import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json());
export default app;

// Data will be coming in the form of JSON // like postman request 
// Data will be coming in the form of req.body from others