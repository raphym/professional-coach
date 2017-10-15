var mongoose = require('mongoose');

var User = require('./user');

var Schema = mongoose.Schema;


var schema = new Schema({
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

schema.post('remove', function (message) {
    User.findById(message.user, function (err, user) {
        if(err)
        {
            //check error
        }
        //remove
        user.messages.pull(message._id);
        user.save();
    });
});
module.exports = mongoose.model('Guestbook-Message', schema);
