import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/todos/user.models.js";
import {z} from "zod";
import { ApiError } from "../utils/ApiError.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// const registerUser=async(req,res)=>{
//     res.json({msg:"The route is working!!"});
// })

const registerUser=asynchandler(async(req,res)=>{

    // Step 1:Write the Zod Schema of the required Body
    const zodSchema =z.object({
        username:z.string().min(5).max(25),
        password:z.string().min(5).max(25),
        fullName:z.string().max(25),
        email:z.email()
    });

        // Step 3: Check for empty fields 
    const {username,password,fullName,email}=req.body;
    if([username,password,fullName,email].some((field)=>field?.trim()=="")){
        return res.status(400).send("All fields are required");
    }
    // Step 2: Perform SafeParse to check for schema validation for req.body

    const parsedatawithsuccess=zodSchema.safeParse(req.body);
    if(!parsedatawithsuccess.success){
        return res.status(400).send("Data not parsed properly by zod error in Data");
    }

    // // Step 3.1: Check if a user with a same username exists or not
    // const userExists=await User.findOne({username}); // Fixed: use object, not function
    // if(userExists) throw new ApiError(400,"User Already Exists");
    // // Step 3.2: Check if a user with a same email exists or not
    // const userExits2=await User.findOne({email}); // Fixed: use object, not function
    // if(userExits2) throw new ApiError(400,"User with same email already exists");
    // // Step 3.3: Check if a user with same both email and password exists or not
    const userExits3=await User.findOne({
        $or:[{username},
            {email},
            {password},
            {fullName}]
// If any one matches, MongoDB returns that document.
    });
    if(userExits3) return res.status(409).json({msg:"User with same email/username/password/fullname already exists"});

    // Step 3.4: Check for images , Check for avatar weather multer has uplaoded it 
    const avatarlocalpath=req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath =req.files.coverImage[0].path;
    }

    if(!avatarlocalpath) throw new ApiError(400,"Avatar File is required");
    // Correctly or not 
    // Step 3.5: Upload them to cloudinary,avatar 
   const avatar= await uploadoncloudinary(avatarlocalpath);
   const coverImage=coverImageLocalPath?await uploadoncloudinary(coverImageLocalPath):null;
// If all unique then only proceed

    if(!avatar){
        throw new ApiError(400,"Avatar File is required"); // Fixed typo
    }  
    // Step 3.6: Hash password before saving
  const user= await User.create({
        username,
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
    });
    // Step 4: Save the info to the Database 
    console.log(user);
    //  Step 4.1: Create User Object - create Entry in DB
    const createdUser= await User.findById(user._id).select("-password -refreshToken");
    console.log(createdUser);
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    // Step 4.2: Remove password and refresh token field from response.

    // Check for user Creation  rerturn res.
    // If any error occur check
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User is Successfully registered")
    )
});

const generateAccessandRefereshToken=async(user)=>{
    try {
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (err) {
        return res.status(500).send({msg:"Unable to generate access and refresh token"});
    }   
}

const loginUser=asynchandler(async(req,res)=>{
    // Get credentials from frontend
    const {username,fullName,password,email}=req.body;

    const zodSchema=z.object({        
        username:z.string().min(5).max(25),
        password:z.string().min(5).max(25),
        fullName:z.string().max(25),
        email:z.email()
    });

    const {success,data}=zodSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({msg:"Credintals given are practically invalid"});
    }
    if([username,fullName,password,email].some((field)=>field?.trim()=="")) return res.status(400).json({msg:"Emptry fields!!"}); 

    const userExists=await User.findOne({
        $or:[{username},{email}]
    });
    console.log(userExists);
    if(!userExists) return res.status(404).json({msg:"User is not registered"});
    const passwordMatch= await userExists.isPasswordCorrect(password,userExists.password);
    console.log(passwordMatch);
    if(!passwordMatch){
        return res.status(400).json({msg:"Password is not matched"});
    }
    const {accessToken,refreshToken}=await generateAccessandRefereshToken(userExists);
    const options={
        httpOnly:true,
        secure:true
    }
    // This means that cookies are only modifiable from the server and not from the 
    // frontend.
    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,{
            user:userExists,
            accessToken,
        },
        "User logged in successfully"
    )
    );
});

const logoutUser=asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"User Logged out"));
});

const refreshAccessToken=asynchandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies.refreshToken;
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized request");
        }
        const decoded=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const userFound=await User.findById(decoded._id);
    
        if(!userFound){
            throw new ApiError(401,"Invalid refresh token"); 
        }
        if(incomingRefreshToken!=userFound?.refreshToken){
            throw new ApiError(401,"Invalid refresh token"); 
        }
        const{accessToken,refreshToken}=generateAccessandRefereshToken(userFound);
        const options={
            httpOnly:true,
            safe:true
        }
    
        return res.status(200)
        .cookie("refreshToken",refreshToken,options)
        .json(accessToken);
    } catch (error) {
        return res.status(404).json(error.message);
    }
});
export {registerUser,loginUser,logoutUser,refreshAccessToken};