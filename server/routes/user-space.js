var express = require('express');
var router = express.Router();
//to encrypt password and also compare
var bcrypt = require('bcryptjs');

//jwt sign password
var jwt_sign_pswd = require('../../config/jwt_sign_pswd');

//require levelright
var level_rights = require('../../config/level_rights');

//to create a token jwt
var jwt = require('jsonwebtoken');

var User = require('../mongoose-models/user');

//UsefulFunctions is the backend
var UsefulFunctions = require('../classes/useful_functions');

//logs
const LogFunctions = require('../classes/log_functions');
logFunctions = new LogFunctions();

//Protection
router.use('/', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            console.log('error');
            console.log(err);
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('security_$_user-space', 'Protection error not authenticated ' + the_err, null, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        next();
    });
});


//get the user
router.get('/getUser', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            console.log('error');
            console.log(err);
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('user-space', 'error getUser Not authenticated ' + the_err, null, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        else {
            User.findOne({ email: decoded.user.email }, function (error, user) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('user-space', 'error getUser find ' + the_err, null, userIp);
                    res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else if (!user) {
                    console.log('error user not found');
                    logFunctions.errorStream('user-space', 'error User not found ' + decoded.user.email, decoded.user._id, userIp);
                    res.status(500).json({
                        title: 'Error',
                        message: 'user not found'
                    });
                }
                else {
                    logFunctions.generalStream('user-space', 'User Authenticated ,Get the User ' + user.email, user._id, userIp);
                    res.status(200).json({
                        title: 'User Authenticated',
                        message: 'Get the User',
                        user: user
                    });
                }
            });
        }
    });
});

//edit the user
router.post('/editUser', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            console.log('error');
            console.log(err);
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('user-space', 'error editUser Not authenticated ' + the_err, null, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        //check if the user edited is the user currently connected
        else if (req.body.id != decoded.user._id) {
            logFunctions.errorStream('security_$_user-space', 'error editUser Not authenticated, id is different ', req.body.id, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        else {
            User.findOne({ _id: req.body.id }, function (error, user) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('user-space', 'error editUser findOne ' + the_err, req.body.id, userIp);
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else if (!user) {
                    logFunctions.errorStream('user-space', 'error editUser findOne not found ', req.body.id, userIp);
                    return res.status(500).json({
                        title: 'Not found',
                        message: 'cannot edit user',
                    });
                }
                else {
                    var labels = req.body.labels;
                    var values = req.body.values;

                    //prepare to update the fields
                    var update = {};
                    //update the fields
                    for (var i = 0; i < labels.length; i++) {
                        update[labels[i]] = values[i];
                    }

                    //execute the update
                    user.update(
                        { $set: update },
                        function (err, success) {
                            if (err) {
                                console.log('error');
                                console.log(err);
                                var the_err = '';
                                try {
                                    the_err = JSON.stringify(err);
                                } catch (e) {
                                    the_err = err;
                                }
                                logFunctions.errorStream('user-space', 'error editUser to update ' + the_err, user._id, userIp);
                                return res.status(500).json({
                                    title: 'Update Problem',
                                    message: 'A problem has occured'
                                });
                            }
                            else if (success) {
                                logFunctions.generalStream('user-space', 'User Edited ' + user.email, user._id, userIp);
                                return res.status(200).json({
                                    title: 'Success',
                                    message: 'The user has been updated',
                                });
                            }
                        }
                    );
                }
            });
        }
    });
});

module.exports = router;