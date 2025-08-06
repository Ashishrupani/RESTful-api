import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const DAY = 86400000;

export const tokenGenerator = (res, userId)=>{
     //create access token
    const token = jwt.sign({id : userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('accesstoken', token, { httpOnly : true, secure : process.env.NODE_ENV === "production", sameSite : "strict", 
        maxAge: 7 * DAY,
    });

    return token;
};
