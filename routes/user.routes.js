import {Router} from "express";
import {registerUser, loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import auth from "../middlewares/Auth.js";
const userRouter=Router();

//  userRouter.route("/register").get(registerUser);


userRouter.route("/register").post(
    upload.fields([
{
    name:"avatar",
    maxCount:1
},{name:"coverImage",maxCount:1}]),registerUser
);

userRouter.route("/login").post(upload.none(),loginUser);
userRouter.route("/logout").post(auth,logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

export default userRouter;