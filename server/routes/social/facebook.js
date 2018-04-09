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
            console.log(!res_fb ? 'error occurred' : res_fb.error);
            return res.status(500).json({
                title: 'error',
                message: 'error'
            });
        }
        else {
            logFunctions.generalStream('social-facebook', 'get fb reviews', null, userIp);
            return res.status(200).json({
                title: 'ok',
                message: 'success',
                data: res_fb.data
            });
        }
    });
});


module.exports = router;
