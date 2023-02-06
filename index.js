const express = require("express");
require('dotenv').config();
const {connection}=require("./config/db");
const {userRout} = require("./routes/userroute")


const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Welcome to Homepage..');
})

app.use("/user",userRout)


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log(`Running at: ${process.env.port}`);
    } catch (error) {
        console.log(error);
    }
})