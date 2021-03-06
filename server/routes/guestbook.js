var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');

//jwt sign password
var jwt_sign_pswd = require('../../config/jwt_sign_pswd');

//model of mongoose
var guestbookMessage = require('../mongoose-models/guestbook-message');
var User = require('../mongoose-models/user');



//get the messages
router.get('/getMessages', function (req, res, next) {
    guestbookMessage.find()
        .populate('user', 'userName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

//Protection
router.use('/protect', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        next();
    });
});

//save the messages
router.post('/protect/saveMessage', function (req, res, next) {

    //get the decoded jwt
    var decoded = jwt.decode(req.cookies['token']);

    //find the user
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        //create new message and adding the user to the message
        var message = new guestbookMessage({
            content: req.body.content,
            user: user._id
        });


        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            //push the message into the user array messages
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});

//update messages
router.patch('/protect/editMessage/:id', function (req, res, next) {

    console.log('update message');
    console.log(req.param.id);
    //get the decoded jwt
    var decoded = jwt.decode(req.cookies['token']);

    guestbookMessage.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                message: 'Message not found'
            });
        }

        //check if the user is the owner of the message
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                message: 'The owner of this message is not authenticated'
            });
        }

        //edit the message with the new content
        message.content = req.body.content;
        //save the message
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});

router.delete('/protect/deleteMessage/:id', function (req, res, next) {

    //get the decoded jwt
    var decoded = jwt.decode(req.cookies['token']);

    guestbookMessage.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                message: 'Message not found'
            });
        }

        //check if the user is the owner of the message
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                message: 'The owner of this message is not authenticated'
            });
        }


        //delete the message
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;
