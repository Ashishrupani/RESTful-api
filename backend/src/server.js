import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cors from "cors";

//config environmental variables
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
  console.log('Connected to MongoDB');  
}).catch((err)=>{
    console.log(err.message);
});

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: `${process.env.CLIENT_URL}`, credentials: true}));

//Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.get(`/`,(req,res)=>{
    res.status(200).send({success: true, message : "Recieving..."});
});



//Listen for connections
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}....`);
});