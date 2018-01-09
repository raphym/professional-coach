'use strict';
var fb_config = require('../config/fb_config');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
        clientID: fb_config.clientID,
        clientSecret: fb_config.clientSecret,
        enableProof: true,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
        

        // passReqToCallback : true,
        // profileFields: ["id", "emails"]
    },
        function (accessToken, refreshToken, profile, done) {
            // User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
            //     return done(err, user);
            // });
            // console.log('passport file');
            // console.log('---------------------');
            // console.log(accessToken);
            // console.log('---------------------');
            // console.log(refreshToken);
            // console.log('---------------------');
            // console.log(profile);
            // console.log('---------------------');

            
            // console.log('---------------------');
            // console.log(profile);
            // console.log('---------------------');
            return done(null,profile);
        }));

};