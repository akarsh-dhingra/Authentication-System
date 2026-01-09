import asynchandler from "../utils/asynchandler.js ";
import { User } from "../models/todos/user.models.js";
import {z} from "zod";
import { ApiError } from "../utils/ApiError.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const registerUser=asynchandler(async(req,res)=>{
    // Step 1:Write the Zod Schema of the required Body
const requiredBody = z.object({
  fullName: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  password: z.string().min(5).max(20),
  email: z.email() // Fixed: z.string().email() instead of z.email()
});
    // Step 2: Perform SafeParse to check for schema validation
    const {username,email,password,fullName}=req.body;

    const parsedatawithsuccess=requiredBody.safeParse(req.body);
    if(!parsedatawithsuccess.success){
        return res.status(404).json({msg:"Data is not correct"});
    }
    // Step 3: Check for empty fields 
    if([username,fullName,email,password].some((field)=>field?.trim()=="")) return res.status(404).json({msg:"All fields are required"});

    // Step 3.1: Check if a user with a same username exists or not
    const userExists=await User.findOne({username}); // Fixed: use object, not function
    if(userExists) throw new ApiError(400,"User Already Exists");
    // Step 3.2: Check if a user with a same email exists or not
    const userExits2=await User.findOne({email}); // Fixed: use object, not function
    if(userExits2) throw new ApiError(400,"User with same email already exists");
    // Step 3.3: Check if a user with same both email and password exists or not
    const userExits3=await User.findOne({
        $or:[{username},
            {email},
            {password},
            {fullName}]
// If any one matches, MongoDB returns that document.
    });
    if(userExits3) return res.status(409).json({msg:"User with same email and username already exists"});

    // Step 3.4: Check for images , Check for avatar weather multer has uplaoded it 
    console.log(req.files?.avatar?.[0]?.path);
    const avatarlocalpath=req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
    if(!avatarlocalpath) throw new ApiError(400,"Avatar File is required");
    // Correctly or not 
    // Step 3.5: Upload them to cloudinary,avatar 
   const avatar= await uploadoncloudinary(avatarlocalpath);
   const coverImage=coverImageLocalPath ? await uploadoncloudinary(coverImageLocalPath) : null;
// If all unique then only
    if(!avatar){
        throw new ApiError(400,"Avatar File is required"); // Fixed typo
    } 
    // Step 3.6: Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
  const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password: hashedPassword, // Save hashed password
        username:username.toLowerCase()
    })
    // Step 4: Save the info to the Database 
    //  Step 4.1: Create User Object - create Entry in DB
    const createdUser= await User.findById(user._id).select("-password -refreshToken");

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
export default registerUser;