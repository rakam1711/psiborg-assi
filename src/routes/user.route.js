import express from "express";
const userroutes = express.Router();

import loginUser from "../controllers/user/loginUser.js";
import verifyOtp from "../controllers/user/verifyOTP.js";
import register from "../controllers/user/register.js";
import listTask from "../controllers/Task/listTask.js";

userroutes.post("/sendotp", loginUser);
userroutes.post("/verifyotp", verifyOtp);
userroutes.post("/register", register);
userroutes.post("/listTask", listTask);

export default userroutes;
