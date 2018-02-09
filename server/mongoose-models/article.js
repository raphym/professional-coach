var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    content: { type: String, required: true },
    intro: { type: String, required: true },
    date: { type: Date, required: true },
    valid: { type: Boolean, required: true }
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('article', schema);