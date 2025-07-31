import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'

//config environmental variables
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
  console.log('Connected to MongoDB');  
}).catch((err)=>{
    console.log(err.message);
});

const app = express();
const PORT = 5000;

//Middleware
app.use(express.json());

//Routes
app.get(`/`,(req,res)=>{
    console.log(`User has hit the server`);
    res.status(200).send(`<h1>Welcome To Home Page</h1>`);
    //res.status(200).json({
    //  message : "This is home page"
    // });
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

//Listen for connections
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}....`);
});