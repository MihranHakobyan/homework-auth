import express from "express";
import authController from "../contreoller/authController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

export const authRouter = express.Router();



authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login)
authRouter.use(isAuthenticated)
authRouter.get("/user",authController.getUserInfo)
authRouter.patch("/login", authController.changeLogin)
