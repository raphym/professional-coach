var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    myUserId:{type:ObjectId , required:true},    
    firstName:{type:String , required:true},
    lastName:{type:String , required:true},
    email:{type:String , required:true},
    phone:{type:Number , required:false },    
    street:{type:String , required:false },
    streetNumber:{type:Number , required:false },
    city:{type:String , required:false },
    country:{type:String , required:false},
    picture:{type:String , required:false}
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('UserProfile',schema);