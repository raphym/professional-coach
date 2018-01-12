var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');

//jwt sign password
var jwt_sign_pswd = require('../../config/jwt_sign_pswd');

//model of mongoose
var Articles = require('../mongoose-models/article');
var User = require('../mongoose-models/user');


//get numbers of articles
router.get('/getArticlesCount', function (req, response, next) {

    Articles.count(function (error, numOfArticles) {
        if (error) {
            console.log('error');
            console.log(error);
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        return response.status(201).json({
            message: 'Get count',
            count: numOfArticles
        });
    });
});

//get a Part Of Articles
router.post('/getPartOfArticles', function (req, response, next) {
    var numsLoadedArticles = req.body.numsLoadedArticles;
    var numsArticlesPerPage = req.body.numsArticlesPerPage;
    var search = req.body.search;
    var fromDate = undefined;
    var toDate = undefined;
    if (req.body.fromDate != undefined && req.body.toDate != undefined) {
        var partsFromDate = req.body.fromDate.split('-');
        var partsToDate = req.body.toDate.split('-');

        fromDate = partsFromDate[2] + '-' + partsFromDate[1] + '-' + partsFromDate[0];
        toDate = partsToDate[2] + '-' + partsToDate[1] + '-' + partsToDate[0];
    }
    var search_by = req.body.search_by;


    //if in the query we are searching by name
    if (search != '' && search != undefined && search_by == 'name') {
        Articles.find({ "title": { "$regex": search, "$options": "i" } }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
            if (error) {
                console.log('error');
                console.log(error);
                response.status(500).json({
                    title: 'Error',
                    message: 'An error has occured'
                });
            }
            return response.status(200).json({
                message: 'Get Articles',
                articles: articles
            });
        });
    }
    //if in the query we are searching by date
    else if (fromDate != undefined && toDate != undefined && search_by == 'date') {
        Articles.find({
            "date": {
                "$gte": new Date(fromDate),
                "$lt": new Date(toDate)
            }
        }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
            if (error) {
                console.log('error');
                console.log(error);
                response.status(500).json({
                    title: 'Error',
                    message: 'An error has occured'
                });
            }
            return response.status(200).json({
                message: 'Get Articles',
                articles: articles
            });
        });
    }
    //if in the query we are searching by name and also by date
    else if (fromDate != undefined && toDate != undefined && search != '' && search != undefined && search_by == 'nameDate') {
        Articles.find({
            "title": { "$regex": search, "$options": "i" },
            "date": {
                "$gte": new Date(fromDate),
                "$lt": new Date(toDate)
            }
        }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
            if (error) {
                console.log('error');
                console.log(error);
                response.status(500).json({
                    title: 'Error',
                    message: 'An error has occured'
                });
            }
            return response.status(200).json({
                message: 'Get Articles',
                articles: articles
            });
        });
    }
    //only display the articles without any search
    else {
        Articles.find({}).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
            if (error) {
                console.log('error');
                console.log(error);
                response.status(500).json({
                    title: 'Error',
                    message: 'An error has occured'
                });
            }
            return response.status(200).json({
                message: 'Get Articles',
                articles: articles
            });
        });
    }
})

//get the articles
router.get('/getArticles', function (req, res, next) {
    Articles.find()
        .exec(function (err, articles) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
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
    Articles.findOne({ _id: req.query.id })
        .exec(function (err, articles) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: articles
            });
        });
});

//get the new last article
router.get('/getNewLastArticle', function (req, res, next) {
    Articles.findOne({}).sort({ date: -1 }).exec(function (error, article) {
        if (error) {
            console.log('error');
            console.log(error);
            res.status(500).json({
                title: 'Error',
                message: 'An error has occured'
            });
        }
        return res.status(200).json({
            message: 'Get Article',
            article: article
        });
    });
});


//Protection
router.use('/', function (req, res, next) {
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        if (decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            return res.status(401).json({
                title: 'Forbidden',
                message: 'You are not an administrator'
            });
        }
        next();
    });
});

//save the articles
router.post('/addArticle', function (req, res, next) {

    //create the new article
    var article = new Articles({
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        intro: req.body.intro,
        date: new Date()
    });

    article.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        res.status(200).json({
            my_response: { title: 'Success', message: 'Your article has been added' },
            obj: result
        });
    });

});


//update article
router.post('/updateArticle', function (req, res, next) {

    Articles.findById(req.body._id, function (err, article) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!article) {
            return res.status(500).json({
                title: 'No Article Found!',
                message: 'Article not found'
            });
        }

        //edit the article with the new content
        article.title = req.body.title;
        article.content = req.body.content;
        article.image = req.body.image;
        article.intro = req.body.intro,

            //save the article
            article.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occured',
                        message: err
                    });
                }
                res.status(200).json({
                    my_response: { title: 'Success', message: 'Your article has been updated' },
                    obj: result
                });
            });
    });
});


//delete an article
router.post('/deleteArticle', function (req, res, next) {


    Articles.findById(req.body._id, function (err, article) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        if (!article) {
            return res.status(500).json({
                title: 'No Article Found!',
                message: 'Article not found'
            });
        }

        //delete the article
        article.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    message: err
                });
            }
            res.status(200).json({
                my_response: { title: 'Success', message: 'Your article has been deleted' },
                obj: result
            });
        });
    });
});


module.exports = router;
