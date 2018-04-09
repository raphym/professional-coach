'use strict';
var fb_config = require('../config/fb_config');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
module.exports = function () {
    passport.use(new FacebookTokenStrategy({
        clientID: fb_config.clientID,
        clientSecret: fb_config.clientSecret,
        enableProof: true,
        callbackURL: fb_config.callbackURL + "auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
    },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }));
};