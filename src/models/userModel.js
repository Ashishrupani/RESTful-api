import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email:{
        type: String,
        required: true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    lastLogin : {type : Date, default : Date.now()},
    isVerified: {type: Boolean, default :false},
    verificationToken : String,
    verificationTokenExpiry : Date,
    resetPasswordToken:String,
    resetPasswordTokenExpiry : Date,

}, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;