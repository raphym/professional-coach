var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');

//jwt sign password
var jwt_sign_pswd = require('../../../config/jwt_sign_pswd');

//fb config id
var fb_config = require('../../../config/fb_config');

//fb npm module
var FB = require('fb');
var fb = new FB.Facebook({ appId: fb_config.clientID, appSecret: fb_config.clientSecret });

//logs
const LogFunctions = require('../../classes/log_functions');
logFunctions = new LogFunctions();

//UsefulFunctions
const UsefulFunctions = require('../../classes/useful_functions');
usefulFunctions = new UsefulFunctions();

//get Facebook Reviews
router.get('/getFbReviews', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var requestToFb = '/';
    requestToFb += fb_config.idPage;
    requestToFb += '/ratings?access_token=';
    requestToFb += fb_config.tokenPage;
    FB.api(requestToFb, function (res_fb) {
        if (!res_fb || res_fb.error) {
            logFunctions.errorStream('social-facebook', 'Error to get fb reviews', null, userIp);
            return res.status(500).json({
                title: 'error',
                message: 'error'
            });
        }
        else {
            //check if there are all the data and the data is valid
            if (res_fb == null || res_fb == undefined || res_fb.data == null || res_fb.data == undefined || res_fb.data.length == 0) {
                logFunctions.errorStream('social-facebook', 'Pb with fb reviews data', null, userIp);
                return res.status(500).json({
                    title: 'error',
                    message: 'error'
                });
            }
            else if (res_fb.data[0].reviewer == null || res_fb.data[0].reviewer == undefined || res_fb.data[0].reviewer.name == null || res_fb.data[0].reviewer.name == undefined || res_fb.data[0].created_time == null || res_fb.data[0].created_time == undefined) {
                //pb with access token to get the name of the reviewer
                logFunctions.errorStream('social-facebook', 'pb with access token to get the names of the reviewers', null, userIp);
                return res.status(500).json({
                    title: 'error',
                    message: 'error'
                });
            } else {
                logFunctions.generalStream('social-facebook', 'get fb reviews', null, userIp);
                return res.status(200).json({
                    title: 'ok',
                    message: 'success',
                    data: res_fb.data
                });
            }
        }
    });
});

//get Facebook Reviews offline
router.get('/getFbReviewsOffline', function (req, res, next) {
    var userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var data = usefulFunctions.getOfflineReviews();
    logFunctions.generalStream('social-facebook', 'get fb reviews offline', null, userIp);
    return res.status(200).json({
        title: 'ok',
        message: 'success',
        data: data
    });
});



module.exports = router;
