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


// Theme model
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
}, {
  tableName: 'Themes',
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
      model: 'Themes',
      key: 'id'
    }
  },
  img_url: Sequelize.STRING
}, {
  tableName: 'Sets',
  timestamps: false
});

// Associate Set with Theme
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

function initialize() {
return sequelize.sync();
}

function getAllSets() {
return Set.findAll({
  include: [Theme]
});
}

function getSetByNum(setNum) {
return Set.findOne({
  where: { set_num: setNum },
  include: [Theme]
});
}

function getSetsByTheme(theme) {
return Set.findAll({
  include: [{
    model: Theme,
    where: {
      name: {
        [Sequelize.Op.iLike]: `%${theme}%`
      }
    }
  }]
});
}

async function addSet(setData) {
  const { name, year, num_parts, img_url, theme_id, set_num } = setData;
  await Set.create({
      name,
      year: parseInt(year, 10),
      num_parts: parseInt(num_parts, 10),
      img_url,
      theme_id: parseInt(theme_id, 10),
      set_num
  });
}

// Invoking functions
initialize().then(() => {
console.log('Initialization successful.');

getAllSets().then(sets => {
  console.log(`Total sets loaded: ${sets.length}`);
}).catch(console.error);

getSetsByTheme('Harry Potter and Fantastic Beasts Series 2').then(harrySets => {
  console.log(`Found ${harrySets.length} Harry Potter and Fantastic Beasts Series 2 sets.`);
}).catch(console.error);

getSetByNum('71028-2').then(set => {
  console.log('Found set by number:', set.get({ plain: true }));
}).catch(console.error);
});

// Function to get all themes
async function getAllThemes() {
  return Theme.findAll();
}


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet };
