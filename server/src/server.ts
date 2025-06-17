import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { syncDB, connectiondDB } from "@/database/connection";
import http from "http";
import { authRouter } from "@/routes/authRoute";
import { Server } from "socket.io";
import { socketHandlers } from "./sockets/socket";
import cors from "cors";
import { userRouter } from "./routes/userRoute";
import { messageRouter } from "./routes/messageRoute";
import { createMonitor, createRole } from "./functions/initial_creation";
//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const socketPort = 5000;
connectiondDB();
syncDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hii Hello, shri");
});

// verifyOTP("+918870762077")

// server_init_function();
// createRole();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow your frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.static("public"));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
const server = http.createServer(app);
server.listen(socketPort, () => {
  console.log(`Socket Server is Fire at http://localhost:${socketPort}`);
});
const io = new Server(server, {
  cors: {
    origin: "*", // or specific frontend like "http://localhost:5173"
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 10e6,
  transports: ["websocket"],
});

socketHandlers(io);
