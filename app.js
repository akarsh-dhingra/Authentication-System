import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app=express();
morgan(function (tokens,req,res){
   return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
    ].join(' ')
});
app.use("/api",(req,res,next)=>{
    const {token}=req.query;
    if(token=="giveAccess"){
        next();
    }
    else{
        res.send("Access Denied");
    }
})

app.use(morgan('combined'));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
// 
app.use(express.static("public"));  // jab bhi koi file aayi yah folder aaya and hum usse apne hee folder mai store rkhna chahte hai 
app.use(cookieParser());
// then it is for that purpose.
// File aa rhi hai image aa rhi hai form sa kuch data aa rha hai 
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

// Middleware are used before sending anything to the client in order to validate the user and at the times to support authentication. 
export default app;

// Data will be coming in the form of JSON // like postman request 
// Data will be coming in the form of req.body from others