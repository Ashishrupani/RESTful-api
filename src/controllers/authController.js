import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {

        //See if a user with that email already exists
        const userExists = await User.findOne({ email });
        if (userExists) return next(errorHandler(401, "Email already exists"));
        
        //Create new user and hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).send("User created succesfully");
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        if(!email || !password) throw Error("All fields required.");

        //See if this user exists
        const userExists = await User.findOne({ email });
        if (!userExists) return next(errorHandler(401, "User not found"));

        //If user exists, validate password
        const validPassword = bcryptjs.compareSync(password, userExists.password);
        if (!validPassword) return next(errorHandler(401, "Invalid credentials"));
        const {password : hashedPassword, ...rest} = userExists._doc;

        //create access token
        const token = jwt.sign({id : userExists._id}, process.env.JWT_SECRET);
        const expireTime = new Date(Date.now() + 3600000);

        res.cookie('access_token', token, { httpOnly : true, expires: expireTime, secure : true})
        .status(200)
        .json(rest);

    } catch (error) {
        next(error);
    }
 };
