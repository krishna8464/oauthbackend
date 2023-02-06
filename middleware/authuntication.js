const {UserModel} = require("../models/usermodel")
const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticator= async function(req,res,next){
    //console.log(1)
    try {
        const token=req.headers.authorization;
        if(!token){
           
           
            res.send('Please login first..!');
        }
      //  console.log(2)
        let blacklistData=JSON.parse(fs.readFileSync('./blacklist.json',"utf-8"));
        if(blacklistData.includes(token)){
          //  console.log(3)
            res.send('Please login again..!');
        }
        
        jwt.verify(token,process.env.key,(err,decoded)=>{
        //   console.log(4)
           
            if(decoded){
               // console.log(5)
                const userrole = decoded.role;
                req.body.userrole = userrole
               // console.log(6)
                next();
            }
            else{
                res.send('Please login first..!');
            }
        })
    } 
    catch (error) {
        res.send('Something went wrongg..!');
    }
}

module.exports={authenticator}