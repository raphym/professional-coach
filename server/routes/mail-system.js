var express = require('express');
var router = express.Router();

//UsefulFunctions in the backend
var UsefulFunctions = require('../classes/useful_functions');

//save the messages
router.post('/send', function (req, res, next) {
  var usefulFunctions = new UsefulFunctions();

  //Email parameters
  var emaildest = req.body.email;
  var textOption = req.body.text_option;
  var objectMail = req.body.object_mail;
  var message_mail = req.body.message;

  usefulFunctions.sendEmail(emaildest, message_mail, objectMail, textOption).then(function (response) {
    res.status(200).json({
      message: 'success',
    });
  }).catch(function (error) {
    console.log(error)
    var my_response = { title: 'Error', message: 'Error to send the mail' };
    return res.status(500).json(my_response);
  })
});


module.exports = router;
