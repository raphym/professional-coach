var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emails_config = require('../../config/emails_config');

//save the messages
router.post('/send', function (req, res, next) {

  var emaildest = req.body.email;

  if (emaildest == 'admin') {
    emaildest = emails_config.EMAIL_ADDRESS;
  }

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
        message: 'An error occurred while sending mail'
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
