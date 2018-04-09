var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');

//jwt sign password
var jwt_sign_pswd = require('../../config/jwt_sign_pswd');

//model of mongoose
var Articles = require('../mongoose-models/article');
var User = require('../mongoose-models/user');

//logs
const LogFunctions = require('../classes/log_functions');
logFunctions = new LogFunctions();

//get numbers of articles
router.get('/getArticlesCount', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err || decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            //the user is not an admin
            //so get the number of the valids articles
            Articles.count({ valid: true }, function (error, numOfArticles) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('article', 'Get count (not admin) ' + the_err, null, userIp);
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else {
                    logFunctions.generalStream('article', 'Get count (not admin)', null, userIp);
                    return res.status(201).json({
                        message: 'Get count',
                        count: numOfArticles
                    });
                }
            });
        }
        else {
            //the user is an admin
            //so get the number of all articles
            Articles.count(function (error, numOfArticles) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('article', 'Get count (admin) ' + the_err, null, userIp);
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else {
                    logFunctions.generalStream('article', 'Get count (admin)', null, userIp);
                    return res.status(201).json({
                        message: 'Get count',
                        count: numOfArticles
                    });
                }
            });
        }
    });
});

//get a Part Of Articles
router.post('/getPartOfArticles', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
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

    //check if the user is an admin
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err || decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            //if in the query we are searching by name
            if (search != '' && search != undefined && search_by == 'name') {
                Articles.find({ "title": { "$regex": search, "$options": "i" }, valid: true }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by name (not admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by name (not admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
            //if in the query we are searching by date
            else if (fromDate != undefined && toDate != undefined && search_by == 'date') {
                Articles.find({
                    "date": {
                        "$gte": new Date(fromDate),
                        "$lt": new Date(toDate)
                    },
                    valid: true
                }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by date (not admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by date (not admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
            //if in the query we are searching by name and also by date
            else if (fromDate != undefined && toDate != undefined && search != '' && search != undefined && search_by == 'nameDate') {
                Articles.find({
                    "title": { "$regex": search, "$options": "i" },
                    "date": {
                        "$gte": new Date(fromDate),
                        "$lt": new Date(toDate)
                    },
                    valid: true
                }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by name and by date (not admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by name and by date (not admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
            //only display the articles without any search
            else {
                Articles.find({ valid: true }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles (not admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles (not admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
        }
        //the user is an admin so get all the aricles
        else {
            //if in the query we are searching by name
            if (search != '' && search != undefined && search_by == 'name') {
                Articles.find({ "title": { "$regex": search, "$options": "i" } }).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by name (admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by name (admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
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
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by date (admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by date (admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
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
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles by name and by date (admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles by name and by date (admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
            //only display the articles without any search
            else {
                Articles.find({}).sort({ date: -1 }).skip(numsLoadedArticles).limit(numsArticlesPerPage).exec(function (error, articles) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(error);
                        } catch (e) {
                            the_err = error;
                        }
                        logFunctions.errorStream('article', 'Get Articles (admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured'
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get Articles (admin)', null, userIp);
                        return res.status(200).json({
                            message: 'Get Articles',
                            articles: articles
                        });
                    }
                });
            }
        }
    });
});

//get the articles
router.get('/getArticles', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err || decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            //the user is not an admin
            //so get only the valids articles
            Articles.find({ valid: true })
                .exec(function (err, articles) {
                    if (err) {
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(err);
                        } catch (e) {
                            the_err = err;
                        }
                        logFunctions.errorStream('article', 'Get all Articles (not admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'An error occured',
                            message: err
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get all Articles (not admin)', null, userIp);
                        res.status(200).json({
                            message: 'Success',
                            obj: articles
                        });
                    }
                });
        }
        else {
            //the user is an admin so get all the articles
            Articles.find()
                .exec(function (err, articles) {
                    if (err) {
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(err);
                        } catch (e) {
                            the_err = err;
                        }
                        logFunctions.errorStream('article', 'Get all Articles (admin) ' + the_err, null, userIp);
                        return res.status(500).json({
                            title: 'An error occured',
                            message: err
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get All Articles (admin)', null, userIp);
                        res.status(200).json({
                            message: 'Success',
                            obj: articles
                        });
                    }
                });
        }
    });
});

//get the article
router.get('/getArticle', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var item_id = req.query.id;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err || decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            //the user is not an admin
            //so get only if the article is valid
            Articles.findOne({ _id: item_id })
                .exec(function (err, article) {
                    if (err) {
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(err);
                        } catch (e) {
                            the_err = err;
                        }
                        logFunctions.errorStream('article', 'Get a specific article (not admin) ' + the_err, item_id, userIp);
                        return res.status(500).json({
                            title: 'An error occured',
                            message: err
                        });
                    }
                    else if (article.valid == true) {
                        logFunctions.generalStream('article', 'Get a specific article (not admin)', item_id, userIp);
                        res.status(200).json({
                            message: 'Success',
                            obj: article
                        });
                    }
                    else {
                        logFunctions.errorStream('article', 'Get a specific article Not authorized (not admin)', item_id, userIp);
                        res.status(401).json({
                            title: 'Not authorized',
                            message: 'Article not approved'
                        });
                    }
                });
        }
        else {
            //the user is an admin so he can get a not valid article
            Articles.findOne({ _id: req.query.id })
                .exec(function (err, article) {
                    if (err) {
                        var the_err = '';
                        try {
                            the_err = JSON.stringify(err);
                        } catch (e) {
                            the_err = err;
                        }
                        logFunctions.errorStream('article', 'Get a specific article (admin) ' + the_err, item_id, userIp);
                        return res.status(500).json({
                            title: 'An error occured',
                            message: err
                        });
                    }
                    else {
                        logFunctions.generalStream('article', 'Get a specific article (admin)', item_id, userIp);
                        res.status(200).json({
                            message: 'Success',
                            obj: article
                        });
                    }
                });
        }
    });
});

//get the new last article
router.get('/getNewLastArticle', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err || decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            //the user is not an admin so check if the article is valid
            Articles.findOne({}).sort({ date: -1 }).exec(function (error, article) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('article', 'get the new last article (not admin) ' + the_err, null, userIp);
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else if (article.valid == true) {
                    logFunctions.generalStream('article', 'Get new last Article (not admin)', null, userIp);
                    return res.status(200).json({
                        message: 'Get Article',
                        article: article
                    });
                }
                else {
                    logFunctions.errorStream('article', 'get the new last article Not authorized (not admin)', null, userIp);
                    res.status(401).json({
                        title: 'Error',
                        message: 'Not authorized'
                    });
                }
            });
        }
        else {
            //the user is an admin so get the article even if it is not valid
            Articles.findOne({}).sort({ date: -1 }).exec(function (error, article) {
                if (error) {
                    console.log('error');
                    console.log(error);
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(error);
                    } catch (e) {
                        the_err = error;
                    }
                    logFunctions.errorStream('article', 'get the new last article (admin) ' + the_err, null, userIp);
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured'
                    });
                }
                else {
                    logFunctions.generalStream('article', 'Get new last Article (admin)', null, userIp);
                    return res.status(200).json({
                        message: 'Get Article',
                        article: article
                    });
                }
            });
        }
    });
});


//Protection
router.use('/', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    jwt.verify(req.cookies['token'], jwt_sign_pswd.SECRET, function (err, decoded) {
        if (err) {
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('security_$_article', 'Protection: Not authenticated ' + the_err, null, userIp);
            return res.status(401).json({
                title: 'Not authenticated',
                message: 'You are not authenticated'
            });
        }
        if (decoded.user == null || decoded.user.levelRights == null || decoded.user.levelRights < 200) {
            logFunctions.errorStream('security_$_article', 'Protection: Forbidden, not an administrator', null, userIp);
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
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //create the new article
    var article = new Articles({
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        intro: req.body.intro,
        date: new Date(),
        valid: false
    });

    article.save(function (err, result) {
        if (err) {
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('article', 'Error to create new article ' + the_err, null, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else {
            logFunctions.generalStream('article', 'New Article added', null, userIp);
            res.status(200).json({
                my_response: { title: 'Success', message: 'Your article has been added' },
                obj: result
            });
        }
    });
});

//update article
router.post('/updateArticle', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var item_id = req.body._id;
    Articles.findById(item_id, function (err, article) {
        if (err) {
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('article', 'Error to find to update article ' + the_err, item_id, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!article) {
            logFunctions.errorStream('article', 'Error to find to update article', item_id, userIp);
            return res.status(500).json({
                title: 'No Article Found!',
                message: 'Article not found'
            });
        }
        else {
            //edit the article with the new content
            article.title = req.body.title;
            article.content = req.body.content;
            article.image = req.body.image;
            article.intro = req.body.intro;
            article.valid = false;

            //save the article
            article.save(function (err, result) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('article', 'Error to update article ' + the_err, item_id, userIp);
                    return res.status(500).json({
                        title: 'An error occured',
                        message: err
                    });
                }
                else {
                    logFunctions.generalStream('article', 'Article updated', item_id, userIp);
                    res.status(200).json({
                        my_response: { title: 'Success', message: 'Your article has been updated' },
                        obj: result
                    });
                }
            });
        }
    });
});

//validate an article
router.post('/validateArticle', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var item_id = req.body.id;
    Articles.findById(item_id, function (err, article) {
        if (err) {
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('article', 'Error to find to validate article ' + the_err, item_id, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!article) {
            logFunctions.errorStream('article', 'Error to find to validate article', item_id, userIp);
            return res.status(500).json({
                title: 'No Article Found!',
                message: 'Article not found'
            });
        }
        else {
            //edit the article with the new content
            article.valid = req.body.validation;

            //save the article
            article.save(function (err, result) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('article', 'Error to validate article ' + the_err, item_id, userIp);
                    return res.status(500).json({
                        title: 'An error occured',
                        message: err
                    });
                }
                else if (article.valid) {
                    logFunctions.generalStream('article', 'Article has been validated', item_id, userIp);
                    my_response = { title: 'Success', message: 'Your article has been validated' };
                    res.status(200).json({
                        my_response: my_response,
                        obj: result
                    });
                }
                else if (!article.valid) {
                    logFunctions.generalStream('article', 'Article has been invalidated', item_id, userIp);
                    my_response = { title: 'Success', message: 'Your article has been invalidated' };
                    res.status(200).json({
                        my_response: my_response,
                        obj: result
                    });
                }
            });
        }
    });
});

//delete an article
router.post('/deleteArticle', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var item_id = req.body._id;
    Articles.findById(item_id, function (err, article) {
        if (err) {
            var the_err = '';
            try {
                the_err = JSON.stringify(err);
            } catch (e) {
                the_err = err;
            }
            logFunctions.errorStream('article', 'Error to find to delete article ' + the_err, item_id, userIp);
            return res.status(500).json({
                title: 'An error occured',
                message: err
            });
        }
        else if (!article) {
            logFunctions.errorStream('article', 'Error to find to delete article', item_id, userIp);
            return res.status(500).json({
                title: 'No Article Found!',
                message: 'Article not found'
            });
        }
        else {
            //delete the article
            article.remove(function (err, result) {
                if (err) {
                    var the_err = '';
                    try {
                        the_err = JSON.stringify(err);
                    } catch (e) {
                        the_err = err;
                    }
                    logFunctions.errorStream('article', 'Error to delete article ' + the_err, item_id, userIp);
                    return res.status(500).json({
                        title: 'An error occured',
                        message: err
                    });
                }
                else {
                    logFunctions.generalStream('article', 'Article deleted', item_id, userIp);
                    res.status(200).json({
                        my_response: { title: 'Success', message: 'Your article has been deleted' },
                        obj: result
                    });
                }
            });
        }
    });
});


module.exports = router;
