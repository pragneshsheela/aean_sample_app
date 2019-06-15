const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');
var arangojs = require('arangojs');
var customDb = require('../Server/models/db');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {

            collection = customDb.collection('users');

            db.query("FOR doc IN users FILTER doc.email == '" + username + "' AND doc.password == '" + password + "' RETURN doc")
                .then(
                    cursor => cursor.all()
                ).then(
                    user => { 
                        if(user.length == 0) {
                            return done(null, false, { message: 'Email and Password not matched' });
                        } else {
                            if(user.length !== 0) {
                                const userModel = new User({
                                    _id: user[0]['_key'],
                                    fullName: user[0]['fullName'],
                                    email: user[0]['email'],
                                    password: user[0]['password'],
                                    saltSecret: user[0]['saltSecret']
                                });
                                return done(null, userModel);
                            } else {
                                return done(null, false, { message: 'Something Went Wrong!!' });
                            }
                        }
                    },
                    err => { 
                        return done(err);
                    });
            })
);