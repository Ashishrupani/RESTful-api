import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

//config environmental variables
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
  console.log('Connected to MongoDB');  
}).catch(()=>{
    console.log('There was an Error connecting to DB..')
});

const app = express();
const PORT = 5000;

//Middleware
app.use(express.json());

//Routes
app.get(`/`,(req,res)=>{
    console.log(`User has hit the server`);
    res.status(200).send(`<h1>Welcome To Home Page</h1>`);
});

//Listen for connections
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}....`);
});