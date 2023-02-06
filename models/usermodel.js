const mongoose = require("mongoose");

const userSchema=mongoose.Schema({
    name:{type : String},
    email:String,
    password : String,
    role:{type :String,enum : ["customer","manager"],default:"customer"},

},{versionKey:false})

//,default:"customer"
//admin - 9t's done differently /manually

const UserModel=mongoose.model('user',userSchema);

module.exports={UserModel}