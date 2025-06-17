import Message from "@/models/Message";
import User from "@/models/User";
import { MiddlewareRequest } from "@/types/express";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const receiveMessages = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, messageType, content } = req.body;

    const fileUrl = `/assets/${messageType.toLowerCase()}s/${req.file?.filename}`; // relative URL

    const message = await Message.create({
      senderId,
      receiverId,
      messageType,
      content: JSON.stringify({ fileUrl, text: content }), // store both
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
};

export const getChatUsers = async (req: MiddlewareRequest, res: Response) => {
  try {
    const { id } = req; // Logged-in user ID

    const chatUsers = await User.findAll({
      attributes: ["id", "avatar", "username", "mobile","displayName", "countryCode"],
      where:{roleName:"USER"},
      include: [
        {
          model: Message,
          as: "sentMessages", // Specify the alias explicitly
          attributes: ["receiverId", "content", "createdAt"],
          // where: { senderId: id },
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
        {
          model: Message,
          as: "receivedMessages", // Specify the alias explicitly
          attributes: ["senderId", "content", "createdAt"],
          // where: { receiverId: id },
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
    });


    res.status(200).json({ message: "Success", data: chatUsers, status: true });
  } catch (err) {
    console.error("Error fetching chat users:", err);
    res.status(500).json({ message: "Chat users fetch failed", status: false });
  }
};

export const conversationMessage = async (
  req: MiddlewareRequest,
  res: Response
) => {
  try {
    const { receiverId } = req.params;

    const { id } = req;

    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: id, receiverId },
          { senderId: receiverId, receiverId: id },
        ],
      },
    });

    if (!conversations) {
      res.status(200).json({
        message: `conversation details not Exist`,
        status: false,
      });
      return;
    }

    res.status(200).json({
      message: "success",
      data: conversations,
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "conversation fetch failed", details: err });
  }
};
