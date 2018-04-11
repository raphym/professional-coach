var fs = require('fs');
var config_log = require('../../config/log_db');
var config_options = require('../../config/options');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pdf = require('html-pdf');
var schedule = require('node-schedule');

//get function from UsefulFunctions
const UsefulFunctions = require('./useful_functions');
var usefulFunctions = new UsefulFunctions();

const config_log_uri = config_log.api + config_log.user + ':' + config_log.pswd + config_log.server + ':' + config_log.port + '/' + config_log.name;
var conn = null;
//connect to the log db
connectLogDb = function () {
    if (config_options.environment == 'prod') {
        conn = mongoose.createConnection(config_log_uri, function () {
            console.log('Log connected');
        });
    }
    else {
        return;
    }
}
connectLogDb();

if (conn != null && conn != undefined) {
    Logs = conn.model('log', new Schema({
        title: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, required: true },
        itemId: { type: String, required: false },
        userIp: { type: String, required: false },
        date: { type: Date, required: true }
    }));
}

//script for the logs
logScript = async function () {
    if (config_options.environment == 'prod') {
        console.log('logScript start');

        //manage GeneralLog
        await manageGeneralLog().then(function (responseManageGeneralLog) {
            var filename = 'general_Logs_';
            filename += getDate();
            filename += '.pdf';
            var attachment = { filename: filename, content: responseManageGeneralLog.data, contentType: 'application/pdf' };
            usefulFunctions.sendEmailWithAttachment(config_options.maintenanceEmail, '', 'Gfit Logs General', 'text', attachment)
                .then(function (response) {
                    //delete general logs
                    Logs.remove({ type: 'GENERAL' }, function (err) {
                        if (err) {
                            console.log('error to delete general logs');
                        }
                        else {
                            console.log('Manage GeneralLog end');
                        }
                    });
                }).catch(function (error) {
                    console.log('Manage GeneralLog end with errors ', error);
                })
        }).catch(function (error) {
            console.log('Manage GeneralLog end with errors , get data ', error);
        })

        //manage ErrorLog
        await manageErrorLog().then(function (responseManageErrorLog) {
            var filename = 'error_Logs_';
            filename += getDate();
            filename += '.pdf';
            var attachment = { filename: filename, content: responseManageErrorLog.data, contentType: 'application/pdf' };
            usefulFunctions.sendEmailWithAttachment(config_options.maintenanceEmail, '', 'Gfit Logs Error', 'text', attachment)
                .then(function (response) {
                    //delete error logs
                    Logs.remove({ type: 'ERROR' }, function (err) {
                        if (err) {
                            console.log('error to delete error logs');
                        }
                        else {
                            console.log('Manage ErrorLog end');
                        }
                    });
                }).catch(function (error) {
                    console.log('Manage ErrorLog end with errors ', error);
                })
        }).catch(function (error) {
            console.log('Manage ErrorLog end with errors ,  get data ', error);
        })
    }
    else {
        console.log('logScript not started (not prod)');
    }
}

//manage general log
manageGeneralLog = function () {
    return new Promise(function (resolve, reject) {
        Logs.find({ type: 'GENERAL' }, function (err, gLogs) {
            if (err) {
                console.log('error to find gLogs');
                reject({ result: 'FAILED', message: 'error to find general logs' });
            }
            else {
                if (gLogs == undefined || gLogs == null)
                    reject({ result: 'FAILED', message: 'error: gLogs == undefined || gLogs == null' });
                else {
                    var generalHtml = "<!DOCTYPE html><html><head><title>G-Fit Log</title></head><body>";
                    generalHtml += "<h1 style='text-align:center;'>G-Fit Log</h1>";
                    generalHtml += "<h1 style='text-align:center;'>GENERAL</h1>";
                    generalHtml += "<div>Number of General logs: ";
                    generalHtml += gLogs.length;
                    generalHtml += "</div><br>";
                    for (var i = 0; i < gLogs.length; i++) {
                        generalHtml += generateSubLogHtml(i, gLogs[i].type, gLogs[i].title, gLogs[i].date, gLogs[i].itemId, gLogs[i].userIp, gLogs[i].content);
                        generalHtml += '<hr>';
                    }
                    generalHtml += "</body></html>";

                    pdfLog(generalHtml, 'generalLogs').then(function (response) {
                        if (response.result == 'SUCCESS')
                            resolve({ result: 'SUCCESS', data: response.data });
                    }).catch(function (error) {
                        reject({ result: 'FAILED', message: 'error to generate Pdf' });
                    })
                }
            }
        });
    });
}

//manage error log
manageErrorLog = function () {
    return new Promise(function (resolve, reject) {
        Logs.find({ type: 'ERROR' }, function (err, eLogs) {
            if (err) {
                console.log('error to find gLogs');
                reject({ result: 'FAILED', message: 'error to find error logs' });
            }
            else {
                if (eLogs == undefined || eLogs == null)
                    reject({ result: 'FAILED', message: 'error: eLogs == undefined || eLogs == null' });
                else {
                    var errorHtml = "<!DOCTYPE html><html><head><title>G-Fit Log</title></head><body>";
                    errorHtml += "<h1 style='text-align:center;'>G-Fit Log</h1>";
                    errorHtml += "<h1 style='text-align:center;'>ERROR</h1>";
                    errorHtml += "<div>Number of Error logs: ";
                    errorHtml += eLogs.length;
                    errorHtml += "</div><br>";
                    for (var i = 0; i < eLogs.length; i++) {
                        errorHtml += generateSubLogHtml(i, eLogs[i].type, eLogs[i].title, eLogs[i].date, eLogs[i].itemId, eLogs[i].userIp, eLogs[i].content);
                        errorHtml += '<hr>';
                    }
                    errorHtml += "</body></html>";

                    pdfLog(errorHtml, 'errorLogs').then(function (response) {
                        if (response.result == 'SUCCESS')
                            resolve({ result: 'SUCCESS', data: response.data });
                    }).catch(function (error) {
                        reject({ result: 'FAILED', message: 'error to generate Pdf' });
                    })
                }
            }
        });
    });
}

//create pdf
pdfLog = function (html, type) {
    return new Promise(function (resolve, reject) {
        pdf.create(html).toBuffer(function (err, buffer) {
            if (err) {
                reject({ result: 'FAILED' });
            }
            else {
                resolve({ result: 'SUCCESS', data: buffer });
            }
        });
    });
}

//generate sub log html for each event
generateSubLogHtml = function (i, type, title, date, itemId, userIp, content) {
    var alert_string = 'security_$_';
    var html = "";
    html += "<div><span style='font-weight: bold;'>Num: </span>";
    html += (i + 1);
    html += "</div>";
    if (title.indexOf(alert_string) > -1) {
        html += "<div><span style='font-weight: bold;color:red;'>Title: </span>";
    }
    else {
        html += "<div><span style='font-weight: bold;'>Title: </span>";
    }
    html += title;
    html += "</div>";
    html += "<div><span style='font-weight: bold;'>Type: </span>";
    html += type;
    html += "</div>";
    html += "<div><span style='font-weight: bold;'>Date: </span>";
    html += date;
    html += "</div>";
    html += "<div><span style='font-weight: bold;'>Item Id: </span>";
    html += itemId;
    html += "</div>";
    html += "<div><span style='font-weight: bold;'>User Ip: </span>";
    html += userIp;
    html += "</div>";
    html += "<div><span style='font-weight: bold;'>Content: </span>";
    html += content;
    html += "</div>";
    return html;
}

//return the date in the good format
getDate = function () {
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

    var exactDate = day + '.' + month + '.' + year;
    return exactDate;
}

//var timeo = setTimeout(logScript, 6000); //for test
//second (0 - 59, OPTIONAL) , minute (0 - 59) , hour (0 - 23) , day of month (1 - 31) , month (1 - 12) , day of week (0 - 7) (0 or 7 is Sun)

var timerLogScript = schedule.scheduleJob('0 20 * * 4', logScript);
module.exports = class LogFunctions {
    constructor() {
    }

    //general stream
    generalStream(title, msg, itemId, userIp) {
        if (config_options.environment == 'prod') {
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
        else {
            return;
        }
    }

    //error stream
    errorStream(title, msg, itemId, userIp) {
        if (config_options.environment == 'prod') {
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
        else {
            return;
        }
    }

} 