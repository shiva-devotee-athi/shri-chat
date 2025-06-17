import { Router } from "express";
import { verifyOTPRegistration } from "@/controllers/authController";
import {
  viewUserDetails,
  viewUserDetailList,
} from "@/controllers/userController";
import { isUser } from "@/middleware/is_user_auth";

export const userRouter = Router();

userRouter.get("/", isUser, viewUserDetails);
userRouter.get("/list", isUser, viewUserDetailList);
