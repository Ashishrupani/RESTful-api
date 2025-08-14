import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { tokenGenerator } from "../utils/tokenGenerator.js";
//import { } from "../mailtrap/emails.js"; won't be using mailtrap anymore
import { sendVerificationEmail , sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail} from "../mail/emails.js";

const DAY = 86400000;

export const signup = async (req, res, next) => {
    const { name , email, password } = req.body;

    try {

        if(!name || !email || !password) throw new Error("All fields are required!");

        //See if a user with that email already exists
        const userExists = await User.findOne({ email });
        if (userExists) throw new Error("Email already exists");
        
        //Create new user and hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiry = Date.now() + DAY; //24 hours expiry time
        const user = new User({ name, email, password: hashedPassword, verificationToken, verificationTokenExpiry});
        await user.save();

        //JWT token
        tokenGenerator(res, user._id);

        //Send verification code
        sendVerificationEmail(user.email, verificationToken);

        user._id = "";
        user.password = "";

        res.status(201).json({sucess : true, message : "User created succesfully", user : user});
    } catch (error) {
        res.status(401).json({sucess : false, message : error.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password) throw Error("All fields required.");

        //See if this user exists
        const userExists = await User.findOne({ email });
        if (!userExists) throw new Error("Invalid credentials");

        //If user exists, validate password
        const validPassword = bcryptjs.compareSync(password, userExists.password);
        if (!validPassword) throw new Error("Invalid credentials");
        const {password : hashedPassword, ...rest} = userExists._doc;

        //Generate a JWT token and set it to the cookie
        tokenGenerator(res, userExists._id);

        userExists.lastLogin = new Date();
        await userExists.save();

        //remove senstitve data
        userExists.password = undefined;

        res.status(200).json({sucess : true, message : "User login in success", user: userExists});

       

    } catch (error) {
        res.status(401).json({sucess : false, message : error.message});
    }
 };

 export const signout = async (req, res)=> {
    res.clearCookie('accesstoken');
    res.status(200).json({sucess : true, message : "User signout was succesful."});
 }


 export const verifyEmail = async (req, res) => {
    const {verificationToken} = req.body;

    try {
        const userExists = await User.findOne({verificationToken , verificationTokenExpiry : { $gt: Date.now()}});

        if(!userExists) throw new Error('Invalid or verification code has expired');

        userExists.isVerified = true;
        //remove code and expiry
        userExists.verificationToken = undefined;
        userExists.verificationTokenExpiry = undefined;

        //save user
        await userExists.save();

        await sendWelcomeEmail(userExists.email, userExists.name);

        res.status(200).json({sucess:true, message: "User verified"});

    } catch (error) {
        res.status(401).json({sucess: false, message : error.message});
    }
 }

 export const forgotPassword = async (req, res) => {
    
    const {email} = req.body;

    try {
        if(!email) throw Error("Email required.");

        const userExists = await User.findOne({email});

        if(!userExists) throw Error("If the email exists a reset link has been sent");

        //generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 900000; // 15 minutes expiry time

        //save token to database
        userExists.resetPasswordToken = resetToken;
        userExists.resetPasswordTokenExpiry = resetTokenExpiry;
        await userExists.save();


        await sendPasswordResetEmail(userExists.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({sucess:true, message: "If the email exists a reset link has been sent"});

    } catch (error) {
        res.status(401).json({sucess:false, message:error.message});
    }
 }

 export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const userExists = await User.findOne({
            resetPasswordToken : token, 
            resetPasswordTokenExpiry : {$gt : Date.now()}
        });

        if (!userExists) throw Error("Invalid or expired token");

        const hashedPassword= await bcryptjs.hash(password, 10);
        userExists.password = hashedPassword;
        userExists.resetPasswordToken = undefined;
        userExists.resetPasswordTokenExpiry = undefined;

        await userExists.save();

        await sendPasswordResetSuccessEmail(userExists.email);

        res.status(200).json({sucess:true, message: "Password has been reset."});
        

    } catch (error) {
        res.status(401).json({sucess:false, message: error.message});
    }
 }


 export const checkAuth = async (req, res) => {
    try {
        const userExists = await User.findOne({_id : req.userId});
        if (!userExists) throw Error("User not found!");

        //remove sensitive data
        userExists.password = undefined;
        res.status(200).json({sucess:true, message:"user was found", user: userExists._doc});
    } catch (error) {
        res.status(401).json({sucess:false, message:error.message});
    }
 }
