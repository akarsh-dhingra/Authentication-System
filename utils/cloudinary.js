import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import { response } from "express";
import fs from "fs";
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
});

const uploadoncloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath){
            return response.status(404).send("localfilepath does not exist");
        }
        // upload the file on cloudinary
        const res=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        });
        console.log("File has been successfully uploaded",res.url);
    } catch (error) {
        fs.unlinkSync(localfilepath); // remove the locally saved   
        // temporary file as the upload gota just failed right now.
    }
}



// cloudinary.uploader
//   .upload("my_image.jpg")
//   .then(result=>console.log(result));



