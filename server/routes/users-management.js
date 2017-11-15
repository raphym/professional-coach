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


//get the list of all users
router.get('/getUsers', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                message: err
            });
        }

        if (decoded.user.levelRights < 200)
            res.status(401).json({
                title: 'Not Authenticated',
                message: 'You are not an Admin'
            });

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
});

module.exports = router;