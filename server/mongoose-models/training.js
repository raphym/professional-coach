var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    myUserId:{type:ObjectId , required:true},        
    title:{type:String , required:true},    
    content:{type:String , required:true},
    image:{type:String , required:false},   
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Training',schema);