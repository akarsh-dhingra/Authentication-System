
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/todos/user.models.js";
dotenv.config();
 
async function auth(req,res,next){
    // Token le kr aaunga from cookies or headers
    // set req.username
    // It's possible that accessToken cookie sa nah aa rha ho 
    // ak custom header user aapko bhj rha ho
 try {
       const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
       if(!token){
           throw new ApiError(401,"unauthorized Request");
       }
       const decodeinfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
       const user= await User.findById(decodeinfo?._id).select("-password -refreshToken");
       if(!user){
           throw new ApiError(401,"Invalid Access Token");
       }
       if(decodeinfo){
           req.user=user;
           next();
       }
       else{
           res.json({
               message:"You are not logged in"
           });
       }
 } catch (err) {
    throw new ApiError(401,err?.message||"Invalid Access Token");
 }
}

export default auth;

