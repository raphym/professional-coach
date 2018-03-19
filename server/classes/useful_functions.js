var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emails_config = require('../../config/emails_config');

module.exports = class UsefulFunctions {
    constructor() {
    }

    //create a random string
    makeRandomString(nums) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 1; i < nums; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    //private function to send a mail
    sendEmail(emaildest, message, object_mail, text_option) {
        return new Promise(function (resolve, reject) {
            if (emaildest == 'admin') {
                emaildest = emails_config.EMAIL_ADDRESS;
            }
            var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (emaildest != 'admin' && !regularExpression.test(String(emaildest).toLowerCase())) {
                reject({
                    title: 'Mail error',
                    message: 'An error occurred while sending mail'
                });
            }
            else {
                //Transporter with OAuth2
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: emails_config.EMAIL_ADDRESS,
                        clientId: emails_config.clientId,
                        clientSecret: emails_config.clientSecret,
                        refreshToken: emails_config.refreshToken,
                        expires: 1484314697598
                    }
                });

                //mail options
                var mailOptions;
                if (text_option == "text") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        text: message
                    };
                }
                else if (text_option == "html") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        html: message
                    };
                }


                //send the mail
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        reject({
                            title: 'Mail error',
                            message: 'An error occurred while sending mail'
                        });
                    } else {
                        resolve({
                            title: 'Mail Success',
                            message: 'Your message has been successfully sent'
                        });
                    }
                });

            }
        });
    }
} 