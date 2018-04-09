const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var mail = require("nodemailer").mail;
var config_database = require('../../config/database');
//logs
const LogFunctions = require('../classes/log_functions');
logFunctions = new LogFunctions();

const DATABASE_ADDRESS = config_database.api + config_database.user + ':' + config_database.pswd + config_database.server + ':' + config_database.port + '/' + config_database.name;
mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect(DATABASE_ADDRESS, function (err, data) {
    if (err) {
        console.log('err : ' + err);
        var the_err = '';
        try {
            the_err = JSON.stringify(err);
        } catch (e) {
            the_err = err;
        }
        logFunctions.errorStream('database', 'Error to connect to the DB  ' + the_err, null, null);
    }
    else {
        console.log('Connected to ', data.name, ' on port: ', data.port);
        logFunctions.generalStream('database', 'Connected to: ' + data.name + ' on port: ' + data.port, null, null);
    }
});

//connect to local database
// try {
//     mongoose.connect('localhost:27017/gab-coach');
//     console.log('Connected to local database!!!');
// } catch (error) {
//     console.log('Error to connect to the local database!!!');
// }

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};


module.exports = router;