/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 04/12/2024

*  Published URL: https://bewildered-foal-loincloth.cyclic.app/
********************************************************************************/
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const legoData = require('./modules/legoSets');
const authData = require('./modules/auth-service');
const clientSessions = require('client-sessions');
const theThemes = ["Basic Set", "Series 21 Minifigures", "Looney Tunes"];
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(clientSessions({
  cookieName: "session",
  secret: process.env.SESSION_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_CS);
    console.log('MongoDB Connected');
    initializeServices();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function initializeServices() {
  try {
    await legoData.initialize();
    await authData.initialize();
    console.log('Data services initialized successfully.');
    setupRoutes();
    app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
  } catch (err) {
    console.error('Failed to initialize data services:', err);
    process.exit(1);
  }
}


function setupRoutes() {
  app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/about', (req, res) => {
    res.render('about');
  });

  app.get('/lego/sets', (req, res) => {
    if (req.query.theme && theThemes.includes(req.query.theme)) {
        legoData.getSetsByTheme(req.query.theme)
        .then(themeSets => {
            res.render('sets', {legoSets: themeSets, currentTheme: req.query.theme, theThemes: theThemes});
        })
        .catch(error => {
            console.error(error);
            res.status(404).render('404', {message: "No Sets found for the matching theme"});
        });
    } else {
        legoData.getAllSets()
        .then(sets => {
            res.render('sets', {legoSets: sets, currentTheme: "", theThemes: theThemes});
        })
        .catch(error => {
            console.error(error);
            res.status(404).render('404', {message: "No Sets found"});
        });
    }
});

app.get('/lego/addSet', ensureLogin, async (req, res) => {
  try {
      const themes = await legoData.getAllThemes();
      res.render('addSet', { themes });
  } catch (error) {
      console.error('Error fetching themes:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.post('/lego/addSet', ensureLogin, async (req, res) => {
    try {
        await legoData.addSet(req.body);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Error adding new set:', error);
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

  app.get('/lego/sets/:set_num', (req, res) => {
    legoData.getSetByNum(req.params.set_num)
      .then(set => {
        res.render('set', {legoSet: set});
      })
      .catch(error => {
        console.error(error);
        res.status(404).render('404', {message: "No Sets found for a set num"});
      });
  });

  app.get('/lego/editSet/:set_num', ensureLogin, async (req, res) => {
    try {
      const set = await legoData.getSetByNum(req.params.set_num);
      if (!set) {
        return res.status(404).render('404', {message: "Set not found"});
      }
      const themes = await legoData.getAllThemes();
      res.render('editSet', {set, themes});
    } catch (error) {
      console.error('Error fetching set or themes:', error);
      res.status(500).render('500', {message: `Error fetching data: ${error.message}`});
    }
  });

  app.post('/lego/editSet', ensureLogin, async (req, res) => {
    const { set_num } = req.body;
    try {
      await legoData.editSet(set_num, req.body);
      res.redirect('/lego/sets');
    } catch (error) {
      console.error('Error updating set:', error);
      res.render('500', {message: `I'm sorry, but we have encountered the following error: ${error.message}`});
    }
  });

  app.get('/lego/deleteSet/:num', ensureLogin, async (req, res) => {
    try {
      await legoData.deleteSet(req.params.num);
      res.redirect('/lego/sets');
    } catch (error) {
      console.error('Error deleting set:', error);
      res.render('500', {message: `I'm sorry, but we have encountered the following error: ${error}`});
    }
  });

  app.get('/login', (req, res) => {
    res.render('login', { errorMessage: '', userName: '' });
  });

  app.get('/register', (req, res) => {
    res.render('register', { successMessage: '', errorMessage: '', userName: '' });
  });

  app.post('/register', async (req, res) => {
    try {
      const user = await authData.registerUser(req.body);
      res.render('register', {
        successMessage: "User created successfully",
        errorMessage: '',
        userName: req.body.userName
      });
    } catch (err) {
      res.render('register', {
        successMessage: '',
        errorMessage: err.message || err,
        userName: req.body.userName
      });
    }
  });

  app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body)
      .then(user => {
        req.session.user = {
          userName: user.userName,
          email: user.email,
          loginHistory: user.loginHistory
        };
        res.redirect('/lego/sets');
      })
      .catch(err => {
        res.render('login', {
          errorMessage: err.message || 'Invalid login attempt',
          userName: req.body.userName
        });
      });
  });

  app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
  });

  app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory');
  });

  app.all('*', (req, res) => {
    res.status(404).render('404', {message: "No view matched for the route"});
  });
}

connectDB();