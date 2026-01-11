import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config();


const connectDb=async ()=>{
try{

    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("MongoDb is running successfully:",connectionInstance.connection._connectionString);
} catch(e){
    console.log("MongoDb is not running");
}
}

export default connectDb;


// Database is always in other continent 

// Scalability 
// Security 
// How to solve the issues that they face.

// Some will tell you an idea you can plan that ship that and you can test that properly then you call yourself a full stack Dev.
// And then you can maintain that 
// Problem solving developer >> Coder deve


