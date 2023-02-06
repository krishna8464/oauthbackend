const {UserModel} = require("../models/usermodel")
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {authenticator}= require("../middleware/authuntication")
const {authorise} = require("../middleware/authorization")
const fs = require("fs")


const userRout = express.Router();

userRout.post("/signup",async(req,res)=>{
    const{name,email,password,role}=req.body;
    try {
        let all_data = await UserModel.find({email});
        if(all_data.length === 0){
            bcrypt.hash(password, 5,async(err,val)=>{
                if(err){
                    res.send("login is not working")
                }else{
                    const user = new UserModel({name,email,password:val,role});
                    await user.save()
                    res.send("User registered Successfully")
                }
            })
        }else{
            res.send("User already Regester")
        }
    } catch (error) {
        res.send("Error in registering the user")
        console.log(error)
    }
})

userRout.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await UserModel.find({email});
        if(user){
            const hashPass=user[0].password;
            bcrypt.compare(password,hashPass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id,role : user[0].role},process.env.key,{expiresIn : 60000});
                    const refresh=jwt.sign({userID:user[0]._id,role:user[0].role},process.env.refresh,{expiresIn : 300000});
                    res.send({"msg":'Login successfull..',token,refresh});
                }
                else{
                    res.send('Wrong credentials..');
                }
            })
        }
        else{
            res.send("This email isn't registered. Please signup first..!");
        }
    } catch (error) {
        res.send('Email not registered..!');
    }
})


userRout.get("/getnewtoken",async(req,res)=>{
    const refresh_token = req.headers.authorization

    if(!refresh_token){
        res.send("login again")
    }
    jwt.verify(refresh_token,process.env.refresh,function(err,decoded){
       // console.log(decoded)
        if(err){
            res.send({"message": "plz login first","err":err.message})
        }else{
            const token = jwt.sign({userID :decoded.userID},process.env.key,{expiresIn : 60000})
            res.send({msg : "login successfull",token})
        }
    })
})

userRout.use(authenticator);

userRout.get("/goldrate",async(req,res)=>{
    res.send("The Goldrate route is working")

})

userRout.get("/userstats",authorise(["manager"]),async(req,res)=>{
    res.send("The userstats is only working for manager")

})

userRout.post('/logout',async(req,res)=>{
    try {
        const token=req.headers.authorization;
        console.log(1)
        let blacklistData=JSON.parse(fs.readFileSync('./blacklist.json', "utf-8"));
        console.log(2)
        blacklistData.push(token);
        fs.writeFileSync('./blacklist.json',JSON.stringify(blacklistData));
        res.send('Logged out successfully..');
    } 
    catch (error) {
        res.send('Something went wrong..!');
    }
})


module.exports={
    userRout
}