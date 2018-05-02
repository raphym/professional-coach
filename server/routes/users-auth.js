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

var cors = require('cors');
var bodyParser = require('body-parser');

var passport = require('passport');
var passportConfig = require('../passport');

//setup configuration for facebook login
passportConfig();

// enable cors
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
router.use(cors(corsOption));

//rest API requirements
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());


//Signup Or SignIn from facebook
router.route('/auth/facebook')
    .post(passport.authenticate('facebook-token', {
        session: false, authType: 'rerequest',
        scope: ['user_friends', 'email', 'public_profile']
    }), function (req, res, next) {
        var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
        if (!req.user) {
            console.log('!req.user');
            logFunctions.errorStream('users-auth', 'Error FB passport.authenticate', null, userIp);
            return res.send(401, 'User Not Authenticated');
        }
        else {
            //get the email from facebook
            var email = req.user.emails[0].value;
            if (email == null || email == undefined || email == '') {
                console.log('user get from fb:');
                console.log(req.user);
                logFunctions.errorStream('users-auth', 'Error FB passport facebook email is not confirmed', null, userIp);
                return res.status(500).json({
                    title: 'An error occured',
                    message: 'Your facebook email is not confirmed'
                });
            }
            else {
                //get the display name from facebook
                var displayName = req.user.displayName;
                if (displayName == null || displayName == undefined || displayName == '') {
                    console.log('user get from fb:');
                    logFunctions.errorStream('users-auth', 'Error FB passport facebook name is not existing', null, userIp);
                    return res.status(500).json({
                        title: 'An error occured',
                        message: 'Your facebook name is not existing'
                    });
                }
                else {
                    User.findOne({ email: email }, function (err, user) {
                        if (err) {
                            var the_err = '';
                            try {
                                the_err = JSON.stringify(err);
                            } catch (e) {
                                the_err = err;
                            }
                            logFunctions.errorStream('users-auth', 'error find user with FB ' + the_err, null, userIp);
                            return res.status(500).json({
                                title: 'An error occured',
                                message: 'Please contact the administrator'
                            });
                        }
                        else if (user) {
                            //the user already exist so sign in
                            //here we create the token
                            user_token = {
                                _id: user._id,
                                levelRights: user.levelRights,
                                userName: displayName,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email
                            };
                            var token = jwt.sign({ user: user_token }, jwt_sign_pswd.SECRET, { expiresIn: 7200 });

                            //insert the token into the cookies (valid 24 Hours)
                            //send the response
                            res.cookie('token', token, { expires: new Date(Date.now() + (60000 * 1440)) });
                            logFunctions.generalStream('users-auth', 'signin user passed throught FB: ' + user.email, user._id, userIp);
                            res.status(200).json({
                                message: 'Successfully logged in',
                                data: user_token
                            });
                        }
                        else if (!user) {
                            //constuct the user with the facebook data
                            var usefulFunctions = new UsefulFunctions();
                            var password = usefulFunctions.makeRandomString(15);
                            var user = new User({
                                userName: displayName,
                                password: bcrypt.hashSync(password, 10),
                                email: email,
                                levelRights: level_rights.USER,
                                registered: true,
                            });

                            //save the user
                            user.save(function (err, user) {
                                if (err) {
                                    var the_err = '';
                                    try {
                                        the_err = JSON.stringify(err);
                                    } catch (e) {
                                        the_err = err;
                                    }
                                    logFunctions.errorStream('users-auth', 'error save user from FB ' + the_err, null, userIp);
                                    return res.status(500).json({
                                        title: 'An error occured',
                                        message: 'Please contact the administrator'
                                    });
                                }
                                //now signin the user
                                //here we create the token
                                user_token = {
                                    _id: user._id,
                                    levelRights: user.levelRights,
                                    userName: displayName,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email
                                };
                                var token = jwt.sign({ user: user_token }, jwt_sign_pswd.SECRET, { expiresIn: 7200 });

                                //insert the token into the cookies (valid 24 Hours)
                                //send the response
                                res.cookie('token', token, { expires: new Date(Date.now() + (60000 * 1440)) });
                                logFunctions.generalStream('users-auth', 'created and signed user passed throught FB: ' + user.email, user._id, userIp);
                                res.status(200).json({
                                    message: 'Successfully logged in',
                                    data: user_token
                                });
                            });
                        }
                    });
                }
            }
        }
    });

//Signup
router.post('/signup', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //create the random randomSecretCode and randomHash
    var usefulFunctions = new UsefulFunctions();
    var randomSecretCode = usefulFunctions.makeRandomString(6);
    var randomHash = usefulFunctions.makeRandomString(20);
    var user = new User({
        userName: req.body.userName,
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
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'Error to create new user  ' + the_err, null, userIp);
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
        else {
            logFunctions.generalStream('users-auth', 'New User created: ' + user.email, result._id, userIp);
            res.status(201).json({
                title: 'User created',
                user: result
            });
        }
    });
});

//Confirm Registration init
router.post('/confirmRegInit', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var randomHash = req.body.randomHash;
    User.findOne({ randomHash: randomHash }, function (err, user) {
        if (err) {//if error request
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'Confirm Registration init error  ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!user) {//if error email
            logFunctions.errorStream('users-auth', 'Confirm Registration init User Not Found', null, userIp);
            return res.status(401).json({
                title: 'User Not Found',
                message: 'The user does not exist'
            });
        }
        else {
            logFunctions.generalStream('users-auth', 'Confirm Registration init Found: ' + user.email, user._id, userIp);
            var my_response = { title: 'Success', user: user };
            res.status(200).json(my_response);
        }
    });
});

//Confirm Registration validation
router.post('/confirmRegValidation', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var randomHash = req.body.randomHash;
    var randomSecretCode = req.body.secretCode;
    User.findOne({ randomHash: randomHash }, function (err, user) {
        if (err) {//if error request
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'Confirm Registration validation error  ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!user) {//if error email
            logFunctions.errorStream('users-auth', 'Confirm Registration validation User Not Found', null, userIp);
            return res.status(401).json({
                title: 'User Not Found',
                message: 'The user does not exist'
            });
        }
        else if (user.randomSecretCode == randomSecretCode.trim()) {
            //assign the registered: true,
            user.registered = true;
            //erase the randomHash
            user.randomHash = -1;
            //erase the randomSecretCode
            user.randomSecretCode = -1;
            //update the user
            user.save(function (err, user) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('users-auth', 'Confirm Registration validation :Error during the update of the User Data ' + user.email + ' ' + the_err, user._id, userIp);
                    var my_response = { title: 'Error', message: 'Error during the update of the User Data' };
                    return res.status(500).json(my_response);
                }
                else if (user) {
                    logFunctions.generalStream('users-auth', 'Confirm Registration validation Updated ' + user.email, user._id, userIp);
                    var my_response = { title: 'Success', message: 'User validate' };
                    return res.status(200).json(my_response);
                }
            });
        }
        else {
            logFunctions.errorStream('security_$_users-auth', 'Confirm Registration validation User Not Validate ' + user.email, user._id, userIp);
            return res.status(401).json({
                title: 'No Validate',
                message: 'User Not Validate'
            });
        }
    });
});

//Signin
router.post('/signin', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {//if error request
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'signin error  ' + req.body.email + ' ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!user) {//if error email
            logFunctions.errorStream('security_$_users-auth', 'signin Login failed user not found ' + req.body.email, null, userIp);
            return res.status(401).json({
                title: 'Login failed',
                message: 'Invalid login credentials'
            });
        }
        //compare the encrypted password with the has of the passwords entered in the signin
        else if (!bcrypt.compareSync(req.body.password, user.password)) {//if error password
            logFunctions.errorStream('security_$_users-auth', 'signin Login failed password error ' + user.email, user._id, userIp);
            return res.status(401).json({
                title: 'Login failed',
                message: 'Invalid login credentials'
            });
        }
        else {
            //check if the User is registered
            if (!user.registered) {
                logFunctions.errorStream('security_$_users-auth', 'signin user email not validated ' + user.email, user._id, userIp);
                return res.status(401).json({
                    title: 'Status Not Registered',
                    message: 'Please confirm your account before loggin'
                });
            }
            else {
                //here we create the token
                user_token = {
                    _id: user._id,
                    levelRights: user.levelRights,
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
                var token = jwt.sign({ user: user_token }, jwt_sign_pswd.SECRET, { expiresIn: 7200 });

                //insert the token into the cookies (valid 24 Hours)
                //send the response
                res.cookie('token', token, { expires: new Date(Date.now() + (60000 * 1440)) });
                logFunctions.generalStream('users-auth', 'signin user passed: ' + user.email, user._id, userIp);
                res.status(200).json({
                    message: 'Successfully logged in',
                    data: user_token
                });
            }
        }
    });
});

//forgotPassword
router.post('/forgotPassword', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var baseUrl = req.protocol + '://' + req.get('host') + '/';

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {//if error request
            console.log(err);
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'forgotPassword error ' + req.body.email + ' ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: 'error'
            });
        }
        else if (!user) {//if error email
            logFunctions.errorStream('security_$_users-auth', 'forgotPassword error User not found ' + req.body.email, null, userIp);
            return res.status(401).json({
                title: 'Error',
                message: 'User not found'
            });
        }
        //check if the User is registered
        else if (!user.registered) {
            logFunctions.errorStream('security_$_users-auth', 'forgotPassword error User not registered ' + user.email, user._id, userIp);
            return res.status(401).json({
                title: 'Status Not Registered',
                message: 'Please confirm your account before loggin'
            });
        }
        else {
            var usefulFunctions = new UsefulFunctions();
            var randomHash = usefulFunctions.makeRandomString(20);
            user.randomHash = randomHash;
            //update the user
            user.save(function (err, user) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('users-auth', 'forgotPassword error during the update of the User Data ' + user.email + ' ' + the_err, user._id, userIp);
                    var my_response = { title: 'Error', message: 'Error during the update of the User Data' };
                    return res.status(500).json(my_response);
                }
                else if (user) {
                    var usefulFunctions = new UsefulFunctions();
                    var message_mail = '<a href="';
                    message_mail += baseUrl;
                    message_mail += 'auth/confirmForgotPassword/';
                    message_mail += randomHash;
                    message_mail += '">Please click here to reset your password</a><br><br>G-Fit Team';
                    usefulFunctions.sendEmail(user.email, message_mail, 'G-Fit Team', "html").then(function (response) {
                        logFunctions.generalStream('users-auth', 'forgotPassword email sent: ' + user.email, user._id, userIp);
                        res.status(200).json({
                            message: 'success',
                        });
                    }).catch(function (error) {
                        console.log(error)
                        logFunctions.errorStream('users-auth', 'forgotPassword error to send forgotPassword email ' + user.email, user._id, userIp);
                        var my_response = { title: 'Error', message: 'Error to send the mail' };
                        return res.status(500).json(my_response);
                    })
                }
            });
        }
    });
});

//confirm forgotPassword for change now
router.post('/confirmForgotPassword', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    User.findOne({ email: req.body.email, randomHash: req.body.randomHash }, function (err, user) {
        if (err) {//if error request
            console.log(err);
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('users-auth', 'confirmForgotPassword error ' + req.body.email + ' ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: 'error'
            });
        }
        else if (!user) {//if error email
            logFunctions.errorStream('security_$_users-auth', 'confirmForgotPassword error User not found ' + req.body.email, null, userIp);
            return res.status(401).json({
                title: 'Error',
                message: 'User not found'
            });
        }
        //check if the User is registered
        else if (!user.registered) {
            logFunctions.errorStream('security_$_users-auth', 'confirmForgotPassword error User not registered ' + user.email, user._id, userIp);
            return res.status(401).json({
                title: 'Status Not Registered',
                message: 'Please confirm your account before loggin'
            });
        }
        else {
            user.randomHash = -1;
            user.password = bcrypt.hashSync(req.body.password, 10);
            //update the user
            user.save(function (err, user) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('users-auth', 'confirmForgotPassword error during the update of the User Data ' + user.email + ' ' + the_err, user._id, userIp);
                    var my_response = { title: 'Error', message: 'Error during the update of the User Data' };
                    return res.status(500).json(my_response);
                }
                else if (user) {
                    logFunctions.generalStream('users-auth', 'forgotPassword password changed : ' + user.email, user._id, userIp);
                    res.status(200).json({
                        message: 'success',
                    });
                }
            });
        }
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