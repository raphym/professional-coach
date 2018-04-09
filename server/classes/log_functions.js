var fs = require('fs');
var config_log = require('../../config/log_db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const config_log_uri = config_log.api + config_log.user + ':' + config_log.pswd + config_log.server + ':' + config_log.port + '/' + config_log.name;
var conn = mongoose.createConnection(config_log_uri, function () {
    console.log('Log connected');
});

var Logs = conn.model('log', new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    itemId: { type: String, required: false },
    userIp: { type: String, required: false },
    date: { type: Date, required: true }
}));

module.exports = class LogFunctions {
    constructor() {
    }

    //general stream
    generalStream(title, msg, itemId, userIp) {
        if (title == null || title == undefined || title == '' || msg == null || msg == undefined || msg == '')
            return;
        var mlog = new Logs({
            title: title,
            content: msg,
            type: 'GENERAL',
            itemId: itemId,
            userIp: userIp,
            date: new Date()
        });
        mlog.save();
    }

    //error stream
    errorStream(title, msg, itemId, userIp) {
        if (title == null || title == undefined || title == '' || msg == null || msg == undefined || msg == '')
            return;
        var mlog = new Logs({
            title: title,
            content: msg,
            type: 'ERROR',
            itemId: itemId,
            userIp: userIp,
            date: new Date()
        });
        mlog.save();
    }

    //return the date in the good format
    getDate() {
        //Date
        var date = new Date();
        // Format the Date
        var day = date.getDate();
        if (day.toString().length == 1)
            day = '0' + day;
        var month = date.getMonth() + 1;
        if (month.toString().length == 1)
            month = '0' + month;
        var year = date.getFullYear();
        year = year.toString().substring(2, year.length);

        // Format the Hour
        var hour = date.getHours();
        if (hour.toString().length == 1)
            hour = '0' + hour;
        var min = date.getMinutes();
        if (min.toString().length == 1)
            min = '0' + min;
        var sec = date.getSeconds();
        if (sec.toString().length == 1)
            sec = '0' + sec;

        var exactDate = day + '/' + month + '/' + year + ' [' + hour + ':' + min + ':' + sec + ']';
        return exactDate;
    }

} 