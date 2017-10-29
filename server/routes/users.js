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


//Signup
router.post('/signup', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        levelRights: level_rights.USER,
        messages: req.body.messages
    });

    //save the user
    user.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
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
