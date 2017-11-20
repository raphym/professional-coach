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

//Signup
router.post('/signup', function (req, res, next) {
    //create the random randomSecretCode and randomHash
    var usefulFunctions = new UsefulFunctions();
    var randomSecretCode = usefulFunctions.makeRandomString(6);
    var randomHash = usefulFunctions.makeRandomString(20);

    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        levelRights: level_rights.USER,
        randomSecretCode: randomSecretCode,
        randomHash: randomHash,
        registered: false,
        messages: req.body.messages
    });

    //save the user
    user.save(function (err, result) {
        if (err) {
            console.log('-------------------------------');
            console.log('User Save Error:');
            console.log(err);
            console.log('-------------------------------');

            if (err.message.includes(' Error, expected `email` to be unique.')) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: 'A user with the same email address is already registered'
                });
            }
            else {
                return res.status(500).json({
                    title: 'An error occured',
                    message: 'Please contact the administrator'
                });
            }
        }

        res.status(201).json({
            title: 'User created',
            user: result
        });
    });
});

//Confirm Registration init
router.post('/confirmRegInit', function (req, res, next) {
    var randomHash = req.body.randomHash;
    User.findOne({ randomHash: randomHash }, function (err, user) {
        if (err) {//if error request
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!user) {//if error email
            return res.status(401).json({
                title: 'User Not Found',
                message: 'The user does not exist'
            });
        }
        var my_response = { title: 'Success', user: user };
        res.status(200).json(my_response);
    });
});

//Confirm Registration validation
router.post('/confirmRegValidation', function (req, res, next) {
    var randomHash = req.body.randomHash;
    var randomSecretCode = req.body.secretCode;
    User.findOne({ randomHash: randomHash }, function (err, user) {
        if (err) {//if error request
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!user) {//if error email
            return res.status(401).json({
                title: 'User Not Found',
                message: 'The user does not exist'
            });
        }

        if (user.randomSecretCode == randomSecretCode) {
            //assign the registered: true,
            user.registered = true;
            //erase the randomHash
            user.randomHash = -1;
            //erase the randomSecretCode
            user.randomSecretCode = -1;
            //update the user
            user.save(function (err, user) {
                if (user) {
                    var my_response = { title: 'Success', message: 'User validate' };
                    res.status(200).json(my_response);
                }
                if (err) {
                    var my_response = { title: 'Error', message: 'Error during the update of the User Data' };
                    res.status(500).json(my_response);
                }
            });

        }
        else {
            return res.status(401).json({
                title: 'No Validate',
                message: 'User Not Validate'
            });
        }
    });
});

//Signin
router.post('/signin', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {//if error request
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!user) {//if error email
            return res.status(401).json({
                title: 'Login failed',
                message: 'Invalid login credentials'
            });
        }
        //compare the encrypted password with the has of the passwords entered in the signin
        if (!bcrypt.compareSync(req.body.password, user.password)) {//if error password
            return res.status(401).json({
                title: 'Login failed',
                message: 'Invalid login credentials'
            });
        }
        //check if the User is registered
        if (!user.registered) {
            return res.status(401).json({
                title: 'Status Not Registered',
                message: 'Please confirm your account before loggin'
            });
        }
        //here we create the token
        user_token = {
            _id: user._id,
            levelRights: user.levelRights,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        var token = jwt.sign({ user: user_token }, jwt_sign_pswd.SECRET, { expiresIn: 7200 });

        //insert the token into the cookies
        //send the response
        res.cookie('token', token);
        res.status(200).json({
            message: 'Successfully logged in',
            data: user_token
        });
    });
});

//islogin
router.post('/islogin', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                message: err
            });
        }
        res.status(200).json({
            message: 'Authenticated',
            data: decoded
        });
    });
});


module.exports = router;