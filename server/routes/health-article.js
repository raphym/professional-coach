var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');

//model of mongoose
var HealthArticles = require('../mongoose-models/health-article');
var User = require('../mongoose-models/user');



//get the articles
router.get('/getArticles', function (req, res, next) {
    HealthArticles.find()
        .exec(function (err, articles) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: articles
            });
        });
});

//get the articles
router.get('/getArticle', function (req, res, next) {
    HealthArticles.findOne({ _id: req.query.id })
        .exec(function (err, articles) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: articles
            });
        });
});


//Protection
router.use('/addArticle', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authenticated',
                error: { message: 'You are not authenticated' }
            });
        }
        next();
    });
});

//save the articles
router.post('/addArticle', function (req, res, next) {

    //get the decoded jwt
    var decoded = jwt.decode(req.query.token);

    //find the user
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        //create new message and adding the user to the message
        var article = new HealthArticles({
            title: req.body.title,
            image: req.body.image,
            content: req.body.content,
        });


        article.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
        });
    });
});

/*
//update messages
router.patch('/:id', function (req, res, next) {

    //get the decoded jwt
    var decoded = jwt.decode(req.query.token);

    guestbookMessage.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
            });
        }

        //check if the user is the owner of the message
        if(message.user != decoded.user._id)
        {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: 'The owner of this message is not authenticated' }
            });
        }

        //edit the message with the new content
        message.content = req.body.content;
        //save the message
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {

    //get the decoded jwt
    var decoded = jwt.decode(req.query.token);

    guestbookMessage.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
            });
        }

        //check if the user is the owner of the message
        if(message.user != decoded.user._id)
        {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: 'The owner of this message is not authenticated' }
            });
        }


        //delete the message
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

*/
module.exports = router;
