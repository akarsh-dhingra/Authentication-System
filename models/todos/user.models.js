import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,  // index true is done when we have to search someting 
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
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"],
            minLength:[8,"Password Must be of at least 8 characters"],
            validate:{
                validator:function(value){
                    return value.length >=8
                },
                message:"Password Must be strong"
            }
        },
        refreshToken:{
            type:String,
        }
    },
    {timestamps:true}  // with this we can automatically generate createdAt and updatedAt
);
// Added 4 layers to the userSchema 
//  Layer 1: hashing the password on saving it for the first time. 
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});
// Why not use next here will study/...
//  Layer 2: Checking if the password is correct.
// This is a method already similar to what we have done. 

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        fullName:this.fullName,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User=mongoose.model("User",userSchema);

// userSchema.pre("save",async function(next){
//     // Har baar password hash nahi krna as in ki jab jab password save ho rha hai 
//     // tab tab
//     if(!this.isModified("password")) return next(); 
//     this.password=bcrypt.hash(this.password,10);
//     next();
//     console.log(this);
//     next(); 
// });  //Don't declare callback in this particular way
