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

const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
setData.forEach(data => {
    let theme = themeData.find(theme => theme.id === data.theme_id);
    
        data.theme = theme?.name;
    sets.push(data);
});

return new Promise((resolve, reject) => {
    if (sets.length > 0) {
        console.log('The "sets" array is filled with objects');
        resolve();
    } else {
        reject('Initialization failed: No sets found');
    }
});
}

function getAllSets() {
    console.log(`Loading ${sets.length} sets`);
    return Promise.resolve(sets);
}

function getSetByNum(setNum) {
    console.log(`Searching for set number: ${setNum}`);
    let set = sets.find(set => set.set_num === setNum);
    return new Promise((resolve, reject) => {
        if (set) {
            resolve(set);
        } else {
            reject('Unable to find requested set with set number: ' + setNum);
        }
    });
}

function getSetsByTheme(theme) {
    console.log(`Filtering sets by theme: ${theme}`);
    let themeSets = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()));
    console.log(themeSets);
    return new Promise((resolve, reject) => {

        if (themeSets) {
            resolve(themeSets);
        } else {
            reject('Unable to find requested sets by theme: ' + theme);
        }
    });

}




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



module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }