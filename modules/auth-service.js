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
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});

let User;

function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.MONGO_CS);
        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model('User', userSchema);
            resolve();
        });
    });
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2 ) {
            return reject("Passwords do not match");
        }

        const passwordRegex = /^.{6,}$/;
        
        if (!passwordRegex.test(userData.password)) {
            reject("Password Length Insufficent!");
            return;
        }

        bcrypt.hash(userData.password, 10)
            .then(hash => {
                let newUser = new User({
                    userName: userData.userName,
                    password: hash,
                    email: userData.email,
                    loginHistory: []
                });

                newUser.save()
                .then(() => resolve())
                .catch(err => {
                    if (err.code === 11000) {
                        reject("User Name already taken");
                    } else {
                        reject(`There was an error creating the user: ${err}`);
                    }
                });
        })
        .catch(err => {
            reject(`There was an error encrypting the password: ${err}`);
        });
});
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .then(user => {
                if (!user) {
                    return reject(`Unable to find user: ${userData.userName}`);
                }

        bcrypt.compare(userData.password, user.password)
        .then(isMatch => {
            if (!isMatch) {
                reject(`Incorrect Password for user: ${userData.userName}`);
                return;
            }


            if (user.loginHistory.length >= 8) {
                user.loginHistory.pop();
            }


            user.loginHistory.unshift({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent
            });


            User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } })
                .then(() => resolve(user))
                .catch(err => reject(`There was an error verifying the user: ${err}`));
        })
        .catch(err => {
            reject(`Error in password comparison: ${err}`);
        });
    })
    .catch(err => {
    reject(`Unable to find user: ${userData.userName}`);
    });
    });
    }


module.exports = { initialize, registerUser, checkUser };
