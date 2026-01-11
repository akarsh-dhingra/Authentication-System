import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import connectDb from "./db/index.js";

const app=express();
// app.use(morgan('combined'));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));

app.use(express.static("public"));  
app.use(cookieParser());

const port = process.env.PORT || 3001;

// // Debug: List all registered routes
// app._router.stack.forEach((middleware) => {
//   if (middleware.route) {
//     // routes registered directly on the app
//     console.log(middleware.route);
//   } else if (middleware.name === 'router') {
//     // router middleware 
//     middleware.handle.stack.forEach((handler) => {
//       if (handler.route) {
//         console.log(handler.route);
//       }
//     });
//   }
// });
app.use("/api/v1/users",userRouter);
connectDb()
  // If database successfully got connected then we will listen
  // to the port
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR", err);
      throw err;
    });
    app.listen(port, () => {
      console.log(`App is listening to ${port}`);
    });
  })
  .catch(() => {
    console.log("It is not running");
  });


export default app;