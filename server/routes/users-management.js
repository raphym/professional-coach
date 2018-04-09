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

//UsefulFunctions in the backend
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
            logFunctions.errorStream('security_$_users-management', 'Protection Forbiden Not authenticated and Not Admin ' + the_err, null, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        else if (decoded.user.levelRights < 200) {
            logFunctions.errorStream('security_$_users-management', 'Protection Forbiden , Not Admin', decoded.user._id, userIp);
            return res.status(401).json({
                title: 'No Authorized',
                message: 'You are not an Admin'
            });
        }
        else {
            next();
        }
    });
});

//get numbers of users
router.get('/getUsersCount', function (req, response, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    User.count(function (error, numOfUsers) {
        if (error) {
            console.log('error');
            console.log(error);
            var the_err = '';
            try {
                the_err = JSON.stringify(error);
            } catch (e) {
                the_err = error;
            }
            logFunctions.errorStream('users-management', 'getUsersCount error (admin) ' + the_err, null, userIp);
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else {
            logFunctions.generalStream('users-management', 'getUsersCount (admin)', null, userIp);
            return response.status(201).json({
                message: 'Get count',
                count: numOfUsers
            });
        }
    });
});

//get part of users
router.post('/getPartOfUsers', function (req, response, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var userRequest = req.body.usersPerPage;
    var userSkip = req.body.pageClicked;
    User.find({}).skip(userRequest * userSkip).limit(userRequest).exec(function (error, users) {
        if (error) {
            console.log('error');
            console.log(error);
            var the_err = '';
            try {
                the_err = JSON.stringify(error);
            } catch (e) {
                the_err = error;
            }
            logFunctions.errorStream('users-management', 'getPartOfUsers error (admin) ' + the_err, null, userIp);
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else {
            logFunctions.generalStream('users-management', 'getPartOfUsers (admin)', null, userIp);
            return response.status(200).json({
                message: 'Get Users',
                users: users
            });
        }
    });
})

//get the list of all users
router.get('/getUsers', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    User.find(function (error, users) {
        if (error) {
            console.log('error');
            console.log(error);
            var the_err = '';
            try {
                the_err = JSON.stringify(error);
            } catch (e) {
                the_err = error;
            }
            logFunctions.errorStream('users-management', 'getAllUsers error (admin) ' + the_err, null, userIp);
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else {
            logFunctions.generalStream('users-management', 'getAllUsers (admin) ', null, userIp);
            res.status(200).json({
                title: 'Admin Authenticated',
                message: 'Get the Users',
                users: users
            });
        }
    });
});

//check email if exist
router.post('/checkEmail', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    User.findOne({ email: req.body.email }, function (error, user) {
        if (error) {
            console.log('error');
            console.log(error);
            var the_err = '';
            try {
                the_err = JSON.stringify(error);
            } catch (e) {
                the_err = error;
            }
            logFunctions.errorStream('users-management', 'checkEmail error (admin) ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else if (user) {
            logFunctions.generalStream('users-management', 'checkEmail:Email used (admin) ', user._id, userIp);
            return res.status(500).json({
                title: 'Email used',
                message: 'Email is already used by a another user',
            });
        }
        else if (!user) {
            logFunctions.generalStream('users-management', 'checkEmail:Email is ok (admin) ', null, userIp);
            return res.status(200).json({
                title: 'Email is ok',
                message: 'We can use this email',
            });
        }
    });
});

//edit a user
router.post('/editUser', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
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
            logFunctions.errorStream('users-management', 'editUser error (admin) ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else if (!user) {
            logFunctions.errorStream('users-management', 'editUser error , user not found (admin)', null, userIp);
            return res.status(500).json({
                title: 'Not found',
                message: 'cannot edit user',
            });
        }
        else {
            var labels = req.body.labels;
            var values = req.body.values;

            //if the mail is changed so update the randomSecretCode,
            //randomHash , and the registered status
            if (req.body.changeEmail) {
                var usefulFunctions = new UsefulFunctions();
                var randomSecretCode = usefulFunctions.makeRandomString(6);
                var randomHash = usefulFunctions.makeRandomString(20);

                labels.push('randomSecretCode');
                labels.push('randomHash');
                labels.push('registered');
                values.push(randomSecretCode);
                values.push(randomHash);
                values.push(false);
            }

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
                        logFunctions.errorStream('users-management', 'editUser error to update (admin) ' + the_err, user._id, userIp);
                        if (err.message.includes('E11000 duplicate key error collection:')) {
                            return res.status(500).json({
                                title: 'An error occured',
                                message: 'A user with the same email address is already registered'
                            });
                        }

                        else {
                            return res.status(500).json({
                                title: 'Update Problem',
                                message: 'A problem has occured'
                            });
                        }
                    }
                    else if (success) {
                        logFunctions.generalStream('users-management', 'editUser updated (admin) ', user._id, userIp);
                        return res.status(200).json({
                            title: 'Success',
                            message: 'The user has been updated',
                            keys: { randomSecretCode: randomSecretCode, randomHash: randomHash }
                        });
                    }
                }
            );
        }
    });
});

module.exports = router;