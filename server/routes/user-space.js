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


//Protection
router.use('/', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            console.log('error');
            console.log(err);
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




//get the user
router.get('/getUser', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            console.log('error');
            console.log(err);
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
                    res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else if (!user) {
                    console.log('error user not found');
                    res.status(500).json({
                        title: 'Error',
                        message: 'user not found'
                    });
                }
                else {
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



module.exports = router;