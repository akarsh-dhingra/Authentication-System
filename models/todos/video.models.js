import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const videoSchema=new Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        thumbNail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:
        }
    },{
        timestamps:true
    }
);

export const Video=mongoose.Model("Video",videoSchema);