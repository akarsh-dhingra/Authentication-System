import mongoose,{Schema} from "mongoose";

const userSchema=new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,  // index true is done when we 
        },
        email:{
            type:String,
            required:true,
            unique:true, 
             lowercase:true,
             trim:true
        },
        password:{
            type:String,
            required: [true, "password is required"],
            max: 12
        },
        fullName:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        isActive:Boolean,
        avatar:{
            type:String,  // it is the URl of cloudinary
            required:true,

        },
        coverImage:{
            type:String,  // image url 
            required:true
        },
        watchHistory:[
            {
                type:Schema.types.objectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"],
            minLength:[8,"Password Must be of at least 8 characters"]
        }

        
    },
    {timestamps:true}
);

export const User=mongoose.Model("User",userSchema);