import express from "express";

const app = express();


//Middleware
app.use(express.json());

//Routes
app.get(`/`,(req,res)=>{
    console.log(`User has hit the server`);
    res.status(200).send(`<h1>Welcome To Home Page</h1>`);
});

app.listen(5000, ()=>{
    console.log(`Server is listening on port 5000`);
});