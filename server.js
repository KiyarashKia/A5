/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 03/20/2024

*  Published URL: https://determined-rose-skunk.cyclic.app/
********************************************************************************/

// https://t.ly/s8wxY

const { log } = require("console");
const legoData = require("./modules/legoSets");
const theThemes = ["Basic Set", "Series 21 Minifigures", "Looney Tunes"];
legoData.initialize();

const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 4050;

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

  app.all('*', (req, res) => { 
    res.status(404).render('404', {message: "No view matched for the route"});
  }); 

  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));