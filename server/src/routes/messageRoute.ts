import { Router } from "express";
import {
  receiveMessages,
  conversationMessage,
  getChatUsers,
} from "@/controllers/messageController";
import { upload } from "@/middleware/upload";
import { isUser } from "@/middleware/is_user_auth";

export const messageRouter = Router();

messageRouter.post("/upload", upload.single("file"), receiveMessages);
messageRouter.get("/chat-user", isUser, getChatUsers);
messageRouter.get("/conversation/:receiverId", isUser, conversationMessage);
messageRouter.get(
  "/fileupload/:receiverId",
  isUser,
  upload.single("file"),

  conversationMessage
);
// authRouter.post("/login", login);
