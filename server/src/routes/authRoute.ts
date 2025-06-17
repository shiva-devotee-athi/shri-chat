import { Router } from "express";
import {
  login,
  loginMonitor,
  register,
  verifyOTPRegistration,
} from "@/controllers/authController";
import { upload } from "@/middleware/upload";

export const authRouter = Router();

authRouter.post("/", (req, res) => {
  res.send(`Auth Loged ${req.body.hello}`);
});
authRouter.post("/register", upload.single("avatar"), register);
authRouter.post("/verify-otp", verifyOTPRegistration);
authRouter.post("/login-admin", loginMonitor);
authRouter.post("/login", login);
