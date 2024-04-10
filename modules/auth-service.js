require('dotenv').config();
const mongoose = require('mongoose');

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
        if (userData.password !== userData.password2) {
            return reject("Passwords do not match");
        }


        let newUser = new User({
            userName: userData.userName,
            password: userData.password,
            email: userData.email,
            loginHistory: []
        });

        newUser.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    return reject("User Name already taken");
                } else {
                    return reject(`There was an error creating the user: ${err}`);
                }
            } else {
                resolve();
            }
        });
    });
}


function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName }).then(user => {
            // User not found
            if (!user) {
                return reject(`Unable to find user: ${userData.userName}`);
            }

            // Password does not match
            if (user.password !== userData.password) {
                return reject(`Incorrect Password for user: ${userData.userName}`);
            }

            // Ensure loginHistory does not exceed 8 entries
            if (user.loginHistory.length >= 8) {
                user.loginHistory.pop();
            }

            // Add new login history entry at the beginning
            user.loginHistory.unshift({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent
            });

            // Update the user with new login history
            User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } })
                .then(() => {
                    resolve(user);
                })
                .catch(err => {
                    reject(`There was an error verifying the user: ${err}`);
                });
        })
        .catch(err => {
            reject(`Unable to find user: ${userData.userName}`);
        });
    });
}


module.exports = { initialize, registerUser, checkUser };
