const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User');
var customDb = require('../models/db');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;

    collection = customDb.collection('users');
    
    db.query("FOR doc IN users FILTER doc.email == '" + user.email + "' RETURN doc")
        .then(
                cursor => cursor.all()
        ).then(
        data => { 
            if(data.length == 0) {
                collection.save(user).then(
                    meta => {
                        res.send(user)
                    } ,
                    err => {console.error('Failed to save document:', err) }
                );
            } else {
                if(data.length !== 0) {
                    res.status(409).send(['Duplicate email address found.']);
                } else {
                    collection.save(user).then(
                        meta => {
                            res.send(user)
                        } ,
                        err => {console.error('Failed to save document:', err) }
                    );
                }
            }
        },
        err => {
            res.status(503).send(['Inernal Server Error.']);
            //return done(err);
        }
    );
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user });
        //else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
}

module.exports.allUsers = (req, res, next) =>{

    collection = customDb.collection('users');

     db.query("FOR user IN users RETURN user")
        .then(
                cursor => cursor.all()
        ).then(
        data => { 
            res.send(data)
        },
        err => { 
            return done(err);
        }
    );
}

module.exports.deleteUsers = (req, res, next) =>{
    var key = req.body.key;
    collection = customDb.collection('users');
    db.query("REMOVE { _key: '" + key + "' }  IN users")
        .then(
                cursor => cursor.all()
        ).then(
        data => { 
            res.send(data)
        },
        err => { 
            return done(err);
        }
    );

    
}
