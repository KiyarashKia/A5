/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 04/10/2024

*  Published URL: https://bewildered-foal-loincloth.cyclic.app/
********************************************************************************/

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

// Associattion 
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

// async addSet
async function addSet(setData) {
  return Set.create(setData).then(() => {
    console.log("Set added successfully");
  }).catch(err => {
    console.error("Error adding set: ", err);
    throw new Error(err.errors[0].message);
  });
}


async function getAllThemes() {
  return Theme.findAll();
}

// async edit set
async function editSet(set_num, setData) {
  try {
      const set = await Set.findOne({ where: { set_num } });
      if (!set) {
          throw new Error("Set not found");
      }
      await set.update(setData);
      console.log(`Set ${set_num} updated successfully`);
  } catch (err) {
      console.error(`Error updating set ${set_num}:`, err);
      throw err;
  }
}

// async delSet
async function deleteSet(set_num) {
  try {
      const result = await Set.destroy({
          where: { set_num }
      });
      if (result === 0) {
          throw new Error("Set not found or already deleted");
      }
      console.log(`Set ${set_num} deleted successfully`);
  } catch (err) {
      console.error(`Error deleting set ${set_num}:`, err);
      throw err;
  }
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet };

