/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 04/02/2024

*  Published URL: https://bewildered-foal-loincloth.cyclic.app/
********************************************************************************/
<<<<<<< HEAD
const authData = require('./modules/auth-service');
const clientSessions = require('client-sessions');
require('dotenv').config();
=======

>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
const { log } = require("console");
const legoData = require("./modules/legoSets");
const theThemes = ["Basic Set", "Series 21 Minifigures", "Looney Tunes"];
legoData.initialize();

const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 4050;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

<<<<<<< HEAD

app.use(clientSessions({
  cookieName: "session",
  secret: "uproRUiiMajTe3koSQGf408VD7ZEMw9q317qeQKx3Qyok2GYNn",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60,
}));


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.userName) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get('/', ensureLogin, async (req, res) => {
=======
app.get('/', (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
  //res.sendFile(path.join(__dirname, '/views/home.html'));
  res.render('home');
  });

<<<<<<< HEAD
  app.get('/about', ensureLogin, async (req, res) => {
=======
  app.get('/about', (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    //res.sendFile(path.join(__dirname, '/views/about.html'));
    res.render('about');
  });

<<<<<<< HEAD
app.get('/lego/sets', ensureLogin, async (req, res) => {
=======
app.get('/lego/sets', (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    console.log(req.query.theme);
    if (req.query.theme){
      legoData.getSetsByTheme(req.query.theme)
      .then(themeSets => {
        res.render('sets', {legoSets: themeSets, currentTheme: req.query.theme, theThemes: theThemes});
      })
      .catch(error => {
          console.error(error);
          res.status(404).render('404', {message: "No Sets found for a matching theme"});
      });
    }
    else {
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


<<<<<<< HEAD
  app.get('/lego/addSet', ensureLogin, async (req, res) => {
=======
  app.get('/lego/addSet', async (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    try {
        const themes = await legoData.getAllThemes();
        res.render('addSet', { themes });
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).send('Internal Server Error');
    }
});
  
<<<<<<< HEAD
app.post('/lego/addSet', ensureLogin, async (req, res) => {
=======
app.post('/lego/addSet', async (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
  try {
      await legoData.addSet(req.body);
      res.redirect('/lego/sets');
  } catch (error) {
      console.error('Error adding new set:', error);
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});


<<<<<<< HEAD
app.get('/lego/sets/:set_num', ensureLogin, async (req, res) => {
=======
app.get('/lego/sets/:set_num', (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    legoData.getSetByNum(req.params.set_num)
    .then(set => {
      res.render('set', {legoSet: set});
    })
    .catch(error => {
        console.error(error);
        res.status(404).render('404', {message: "No Sets found for a set num"});
    });
  });


<<<<<<< HEAD
  app.get('/lego/editSet/:set_num', ensureLogin, async (req, res) => {
=======
  app.get('/lego/editSet/:set_num', async (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        if (!set) {
            return res.status(404).render('404', { message: "Set not found" });
        }
        const themes = await legoData.getAllThemes();
        res.render('editSet', { set, themes });
    } catch (error) {
        console.error('Error fetching set or themes:', error);
        res.status(500).render('500', { message: `Error fetching data: ${error.message}` });
    }
});

<<<<<<< HEAD
app.post('/lego/editSet', ensureLogin, async (req, res) => {
=======
app.post('/lego/editSet', async (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
    const { set_num } = req.body;
    try {
        await legoData.editSet(set_num, req.body);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Error updating set:', error);
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    }
});

<<<<<<< HEAD
app.get('/lego/deleteSet/:num', ensureLogin, async (req, res) => {
=======
app.get('/lego/deleteSet/:num', async (req, res) => {
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
  try {
      await legoData.deleteSet(req.params.num);
      res.redirect('/lego/sets');
  } catch (error) {
      console.error('Error deleting set:', error);
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});

<<<<<<< HEAD
authData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to start the server: ${err}`);
  });

  legoData.initialize()
.then(() => {
  console.log('Lego Data Initialized');
  return authData.initialize();
})
.then(() => {
  console.log('Auth Data Initialized');
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}`);
  });
})
.catch(err => {
  console.error(`Initialization failed: ${err}`);
});
=======
  app.all('*', (req, res) => { 
    res.status(404).render('404', {message: "No view matched for the route"});
  }); 

  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
>>>>>>> 9c11305bc4eb66f24f9f3ff5bb36ba80734c981e
