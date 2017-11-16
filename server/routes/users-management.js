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

//Protection
router.use('/', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        if (decoded.user.levelRights < 200) {
            return res.status(401).json({
                title: 'No Authorized',
                message: 'You are not an Admin'
            });
        }
        next();
    });
});

//get the list of all users
router.get('/getUsers', function (req, res, next) {
    User.find(function (error, users) {
        if (error) {
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else {
            res.status(200).json({
                title: 'Admin Authenticated',
                message: 'Get the Users',
                users: users
            });
        }
    });
});

//edit a user
router.post('/editUser', function (req, res, next) {
    User.findOne({ _id: req.body.id }, function (error, user) {
        if (error) {
            return res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        else if (!user) {
            return res.status(500).json({
                title: 'Not found',
                message: 'cannot edit user',
            });
        }
        else {
            var labels = req.body.labels;
            var values = req.body.values;
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
                    if (success) {
                        return res.status(200).json({
                            title: 'Success',
                            message: 'The user has been updated'
                        });
                    }
                }
            );
        }
    });
});

module.exports = router;