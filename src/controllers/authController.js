import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { tokenGenerator } from "../utils/tokenGenerator.js";
import { sendVerificationEmail , sendWelcomeEmail} from "../mailtrap/emails.js";

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

        //Send a one time pin


        res.status(200).json({sucess : true, message : "User login in success"});

       

    } catch (error) {
        res.status(401).json({sucess : false, message : error.message});
    }
 };

 export const signout = async (req, res)=> {
    res.clearCookie('access_token');
    res.status(200).json({sucess : true, message : "Signout works"});
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
