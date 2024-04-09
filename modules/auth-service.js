require('dotenv').config();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
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
            reject("Passwords do not match");
            return;
        }

        let newUser = new User(userData);
        newUser.save()
            .then(() => resolve())
            .catch(err => {
                if (err.code === 11000) {
                    reject("User Name already taken");
                } else {
                    reject(`There was an error creating the user: ${err}`);
                }
            });
    });
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .then(user => {
                if (!user) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else if (user.password !== userData.password) {
                    reject(`Incorrect Password for user: ${userData.userName}`);
                } else {
                    // Assume we have userData.userAgent from somewhere
                    user.loginHistory.unshift({ dateTime: new Date().toString(), userAgent: userData.userAgent });
                    if (user.loginHistory.length > 8) user.loginHistory.pop();
                    
                    user.save()
                        .then(() => resolve(user))
                        .catch(err => reject(`There was an error verifying the user: ${err}`));
                }
            })
            .catch(err => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}


module.exports = { initialize, registerUser, checkUser };
