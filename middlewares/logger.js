import express from "express";

const logger=(req,res,next)=>{
    const start=Date.now();

    res.on("finish",()=>{
        const Duration=Date.now()-start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Duration}ms}`);
    });
    next();
}
export default logger;