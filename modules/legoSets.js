/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 02/05/2024
*
********************************************************************************/

// const setData = require("../data/setData");
// const themeData = require("../data/themeData");
require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
});
//   sequelize
//     .authenticate()
//     .then(() => {
//       console.log('Connection has been established successfully.');
//     })
//     .catch((err) => {
//       console.log('Unable to connect to the database:', err);
//     });

// Theme model
const Theme = sequelize.define('Theme', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING
  }, {
    tableName: 'Themes', // table name if
    timestamps: false
  });
  
  // Set model
  const Set = sequelize.define('Set', {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Themes', // This references the 'Themes' table
        key: 'id' // The 'id' column in the 'Themes' table
      }
    },
    img_url: Sequelize.STRING
  }, {
    tableName: 'Sets', // table name
    timestamps: false
  });
  
  // Associate Set with Theme
  Set.belongsTo(Theme, { foreignKey: 'theme_id' });
  
  // Synchronize the models with the database
  sequelize.sync().then(() => {
    console.log('Models have been synchronized successfully.');

    return Theme.create({
        name: 'Space'
      });
    }).then(theme => {
      console.log('New Theme added:', theme.toJSON());
    
      // Using the id of the newly created Theme, add an instance to the Set table
      return Set.create({
        set_num: '12345',
        name: 'Satellite Launch Station',
        year: 2021,
        num_parts: 517,
        theme_id: theme.id, // Use the id from the newly created Theme instance
        img_url: 'http://example.com/image_of_set.jpg'
      });
    }).then(set => {
      console.log('New Set added:', set.toJSON());
    }).catch(error => {
      console.error('Error adding instances:', error);
    });


// let sets = [];

// function initialize() {
// setData.forEach(data => {
//     let theme = themeData.find(theme => theme.id === data.theme_id);
    
//         data.theme = theme?.name;
//     sets.push(data);
// });

// return new Promise((resolve, reject) => {
//     if (sets.length > 0) {
//         console.log('The "sets" array is filled with objects');
//         resolve();
//     } else {
//         reject('Initialization failed: No sets found');
//     }
// });
// }

// function getAllSets() {
//     console.log(`Loading ${sets.length} sets`);
//     return Promise.resolve(sets);
// }

// function getSetByNum(setNum) {
//     console.log(`Searching for set number: ${setNum}`);
//     let set = sets.find(set => set.set_num === setNum);
//     return new Promise((resolve, reject) => {
//         if (set) {
//             resolve(set);
//         } else {
//             reject('Unable to find requested set with set number: ' + setNum);
//         }
//     });
// }

// function getSetsByTheme(theme) {
//     console.log(`Filtering sets by theme: ${theme}`);
//     let themeSets = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()));
//     console.log(themeSets);
//     return new Promise((resolve, reject) => {

//         if (themeSets) {
//             resolve(themeSets);
//         } else {
//             reject('Unable to find requested sets by theme: ' + theme);
//         }
//     });

// }




//Invoking 
// initialize().then(() => {
//     console.log('Initialization successful.');

//     getAllSets().then(sets => {
//         console.log(`Total sets loaded: ${sets.length}`);
//     });


//     getSetsByTheme('Harry Potter and Fantastic Beasts Series 2').then(harrySets => {
//         console.log(`Found ${harrySets.length} Harry Potter and Fantastic Beasts Series 2 sets.`);
//     }).catch(console.error);

 
//     getSetByNum('71028-2').then(set => {
//         console.log('Found set by number:', set);
//     }).catch(console.error);
// })



// module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }