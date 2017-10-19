var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName:{type:String , required:true},
    lastName:{type:String , required:true},
    password:{type:String , required:true},
    email:{type:String , required:true ,unique:true},
    levelRights:{type:Number , required:true},   
    phone:{type:Number , required:false },    
    street:{type:String , required:false },
    streetNumber:{type:Number , required:false },
    city:{type:String , required:false },
    country:{type:String , required:false},
    picture:{type:String , required:false},    
    messages:[{type:Schema.Types.ObjectId, ref:'Message'}]

});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User',schema);