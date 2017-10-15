var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config_constants = require('../../config/constant');

//save the messages
router.post('/send', function (req, res, next) {

  var emaildest = req.body.email;

  if (emaildest == 'admin') {
    emaildest = config_constants.EMAIL_ADDRESS;
  }

  //console.log("mail-system : " + JSON.stringify(req.body) );
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: config_constants.EMAIL_ADDRESS,
      pass: config_constants.EMAIL_PSWD
    }
  }));

  var mailOptions;
  if (req.body.text_option == "text") {
    mailOptions = {
      from: 'no-reply@gab-coach.com',
      to: emaildest,
      subject: req.body.object_mail,
      text: req.body.message
    };
  }
  else if (req.body.text_option == "html") {
    mailOptions = {
      from: 'no-reply@gab-coach.com',
      to: emaildest,
      subject: req.body.object_mail,
      html: req.body.message
    };
  }




  //send the mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        title: 'Mail error',
        error: { message: 'An error occurred while sending mail' }
      });
    } else {
      return res.status(200).json({
        title: 'Mail Success',
        message: 'Your message has been successfully sent'
      });
    }
  });

});


module.exports = router;
