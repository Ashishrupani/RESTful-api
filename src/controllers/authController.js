import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        //See if a user with that email already exists
        const userExists = await User.findOne({ email });
        if (userExists) throw Error("Email already exists");
        
        //Create new user and hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({
            message: "User created succesfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const login = async (req, res) => { };
