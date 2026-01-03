import express from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET="akarshloveskiara";
const app=express();

const users=[];

function auth(req,res,next){
    const token =req.header.authorization;
    const decodeinfo=jwt.verify(token,JWT_SECRET);

    if(decodeinfo.username){
        req.username=decodeinfo.username;
        next();
    }
    else{
        res.json({
            message:"You are not logged in"
        });
    }
}

app.post("/signin",(req,res)=>{
    const {username,password}=req.body;
    const userFound=users.find((u)=>u.username==username && u.password==password);

    if(userFound){
        const token=jwt.sign({
            username:userFound
        },JWT_SECRET);
        res.json({
            token:token
        });
    }
    else{
        res.status(404).send("Incorrect Credentials");
    }
});
app.get("/me",(req,res)=>{
    const token=req.headers.authorization;

    const decodedInfo=jwt.verify(token,JWT_SECRET);
    // jwt.decode (token)
    const username=decodedInfo.username;
    const user=users.find((u)=>u.username==username);
    if(user){
        res.json({
            username:user.username,
            password:user.password
        })
    }else{
        res.json({
            username:user.username,
            password:user.password
        })     
    }
    // verifying the token.
    // If you end up decoding toh unka bhi token validhojayga toh make sure you ae 

})

app.post("/signup",(req,res)=>{
    const {username,password}=req.body;
    users.push({username,password});
    res.json({msg:"User is signed up"});
})