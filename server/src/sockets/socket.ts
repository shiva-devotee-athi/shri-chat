import User from "@/models/User";
import { Socket, Server } from "socket.io";
import Message from "@/models/Message";
import { getFolder } from "@/utils/constants";
import fs from "fs";
import { IMediaFileReq, ITextMessageReq } from "@/types/socket";
import path from "path";

const onlineUsers = new Map();

export const socketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id);

    socket.on("user_online", async ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      await User.update({ isOnline: true }, { where: { id: userId } });
      io.emit("update_user_status");
    });

    socket.on("send_message", async (data) => {
      const { senderId, receiverId, content, messageType }: ITextMessageReq =
        data;
      const message = await Message.create({
        senderId,
        receiverId,
        content,
        messageType,
      });

      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", message);
      }
    });

    socket.on("send_media_file", async (data) => {
        try {
        const {
          senderId,
          receiverId,
          content,
          messageType,
          fileName,
          fileBuffer,
        }: IMediaFileReq = data;

        if (!senderId || !receiverId || !fileName || !fileBuffer) {
          console.error("Missing required fields");
          return;
        }

        // Define the folder based on message type
        const messageFolder = messageType.toLowerCase();
        const folder = getFolder(messageFolder);
        const targetDir = path.join(__dirname, `../../public/assets/${folder}`);
        console.log(targetDir)
        // Ensure folder exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const finalFileName = `${Date.now()}_${crypto.randomUUID()}_${fileName}`;
        const filePath = path.join(targetDir, finalFileName);
        const fileUrl = `/assets/${folder}/${finalFileName}`;

        // Save the file as a Promise
        // await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
        await fs.promises.writeFile(filePath, fileBuffer);

        // Create message
        const message = await Message.create({
          senderId,
          receiverId,
          content,
          messageType,
          fileurl:fileUrl,
        });

        // Send message to the receiver if online
        // Emit after successful file save + DB insert
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", message);
        }
      } catch (err) {
        console.error("send_media_file error:", err);
      }
    });

    socket.on("disconnect", async () => {
      const userId = [...onlineUsers.entries()].find(
        ([, s]) => s === socket.id
      )?.[0];
      if (userId) {
        await User.update({ isOnline: false }, { where: { id: userId } });
        onlineUsers.delete(userId);
        io.emit("update_user_status");
      }
    });
  });
};
