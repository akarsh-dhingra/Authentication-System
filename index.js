import dotenv from "dotenv";
dotenv.config();

import express from "express";

import cookieParser from "cookie-parser";
import app from "./app.js";

app.use(express.json({ limit: "16kb" })); // It is used to parse the JSON data.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // It is ude
app.use(express.static("public"));
app.use(cookieParser());


// Main jargon for today is understanding how json data coming is being understood by My backend and
// Potentially then rendered over the screen as well.
// res.send()  res.json()

// (async ()=> {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}`);
//         app.on("error",(err)=>{
//             console.log("Error",err);
//             throw err;
//         })
//         app.listen(port,()=>{
//             console.log(`App is listening to ${port}`);
//         })
//     }catch(e){
//         console.error(e);
//     }
// }
// )()

// const userDb=[{id:1,name:"Akarsh",todo:"Go to gym"},{id:2,name:"Swapnil",todo:"Go to Banglore"}];

// app.get("/",(req,res)=>{
//     res.send("Server is listening ");

// });

// app.post("/signIn",(req,res)=>{

// })

// app.get("/api/users",(req,res)=>{
// res.send(userDb);
// })


