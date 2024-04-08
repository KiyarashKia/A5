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

app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, '/views/home.html'));
  res.render('home');
  });

  app.get('/about', (req, res) => {
    //res.sendFile(path.join(__dirname, '/views/about.html'));
    res.render('about');
  });

app.get('/lego/sets', (req, res) => {
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


  app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render('addSet', { themes });
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).send('Internal Server Error');
    }
});
  
app.post('/lego/addSet', async (req, res) => {
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


  app.get('/lego/editSet/:set_num', async (req, res) => {
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

app.post('/lego/editSet', async (req, res) => {
    const { set_num } = req.body;
    try {
        await legoData.editSet(set_num, req.body);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Error updating set:', error);
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
  try {
      await legoData.deleteSet(req.params.num);
      res.redirect('/lego/sets');
  } catch (error) {
      console.error('Error deleting set:', error);
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});

  app.all('*', (req, res) => { 
    res.status(404).render('404', {message: "No view matched for the route"});
  }); 

  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));