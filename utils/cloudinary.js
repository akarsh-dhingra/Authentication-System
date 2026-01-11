import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({
    path:'./.env'
});
console.log(process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadoncloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath){
            throw new Error("localfilepath does not exist");
        }
        // upload the file on cloudinary
        const res=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        });
        fs.unlinkSync(localfilepath); // remove the locally saved temp file after upload
        return res;
    } catch (error) {
        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath); // remove the locally saved temp file as the upload failed
        }
        throw error;
    }
}

export default uploadoncloudinary;

// cloudinary.uploader
//   .upload("my_image.jpg")
//   .then(result=>console.log(result));



