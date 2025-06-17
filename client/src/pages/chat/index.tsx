import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages, { Message } from "./ChatMessages";
import MessageInput from "./MessageInput";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getAllUserList } from "@/action/user.action";
import { getAllChatUser, getAllConversations } from "@/action/message.action";
import { toast } from "react-toastify";


// [
//     {
//     from: "client",
//     text: "",
//     time: "15 mins",
//   },

//   {
//     from: "admin",
//     text: "",
//     time: "2 hours ago",
//   },
//   {
//     from: "admin",
//     text: "",
//     time: "2 hours ago",
//   },
// ]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<IChatUserData[]>([]);
  const [chatUser, setChatUser] = useState<IChatUserData | null>(null);
  const [profile, setProfile] = useState<IChatUserData | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaFileBuffer, setMediaFileBuffer] = useState<Buffer | null>(null);

  const [isOpen, setisOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const token = Cookies.get("token") || "";

  const decode: JwtPayload & { id: string; role: string; mainId: string } =
    jwtDecode(token!);

  useEffect(() => {
    fetchContactData();
    fetchChatUserData();
  }, []);

  useEffect(() => {
    if (!chatUser) {
      return;
    }
    fetchConversations(chatUser.id);
  }, [chatUser]);

  const fetchContactData = async () => {
    setLoader(true);
    const response = await getAllUserList();
    setLoader(false);
    if (response.status) {
      const chatList = response.data as IChatUserData[];
      const myProfileData = chatList.find((item) => item.id === decode.id);
      setProfile(myProfileData!);
    }
  };

  const fetchChatUserData = async () => {
    setLoader(true);
    const response = await getAllChatUser();
    setLoader(false);
    if (response.status) {
      const chatList = response.data as IChatUserData[];
      const myFriends = chatList.filter((item) => item.id !== decode.id);
      setUsers(myFriends);
    }
  };

  useEffect(() => {
    const sock: Socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    sock.on("connect", () => {
      sock.emit("user_online", { userId: decode.id });
    });

    sock.on("receive_message", (msg) => {
      if (msg.senderId === chatUser?.id || msg.receiverId === chatUser?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    setSocket(sock);
    return () => {
      sock.disconnect(); // ✅ proper cleanup
    };
  }, [chatUser]);

  const sendMessage = ({ type, messageType }: ISendMediaMessageProps) => {
    if (type == "TEXT") {
      sendTextMessage();
    }

    if (type == "MEDIA") {
      sendMediaMessage(messageType);
    }
  };

  const sendTextMessage = () => {
    if (!socket) {
      console.error("socket not connected");
      return;
    }
    if (input.trim()) {
      const msg = {
        senderId: decode.id,
        receiverId: chatUser?.id!,
        content: input,
        messageType: "TEXT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const payloadMsg = {
        senderId: decode.id,
        receiverId: chatUser?.id!,
        content: input,
        messageType: "TEXT",
      };
      setMessages([
        ...messages,
        {
          ...msg,
          id: (
            Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
          ).toString(),
          messageType: "TEXT",
        },
      ]);
      socket.emit("send_message", payloadMsg);
      setInput("");
    }
  };

  const sendMediaMessage = (messageType: MessageType) => {
    if (!socket) {
      toast.error("socket not connected");
      return;
    }
    if (!mediaFile) {
      toast.error("Media File Missing");
      return;
    }
    if (!mediaFileBuffer) {
      toast.error("Media File Missing");
      return;
    }
    const fileName = mediaFile.name;

    const msg = {
      senderId: decode.id,
      receiverId: chatUser?.id!,
      content: input,
      messageType,
      fileurl: URL.createObjectURL(mediaFile),
      // fileurl:`/assets/${folder}/${fileName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payloadMsg = {
      senderId: decode.id,
      receiverId: chatUser?.id!,
      content: input,
      messageType,
      fileName,
      fileBuffer: mediaFileBuffer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages([
      ...messages,
      {
        ...msg,
        id: (
          Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        ).toString(),
      },
    ]);
    socket.emit("send_media_file", payloadMsg);
    setInput("");
    setMediaFile(null);
  };

  const handleChatUser = (data: IChatUserData) => {
    setChatUser(data);
  };

  const fetchConversations = async (id: string) => {
    setLoader(true);
    const response = await getAllConversations(id);
    setLoader(false);
    if (response.status) {
      const convo = response.data as Message[];
      setMessages(convo);
    }
  };

  if (!profile) {
    return <p>Loading Please Wait</p>;
  }
  return (
    <div className="container pt-8">
      <div className="flex flex-col md:flex-row h-[calc(100vh-150px)] overflow-hidden shadow-lg rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <ChatSidebar
          users={users}
          isOpen={isOpen}
          setIsOpen={setisOpen}
          profile={profile}
          handleChatUser={handleChatUser}
        />
        <div className="w-full h-full md:w-2/3 lg:w-3/4 flex flex-col justify-between">
          <ChatHeader
            onMobileMenu={() => setisOpen(!isOpen)}
            chatUser={chatUser}
          />
          <ChatMessages
            chatUser={chatUser}
            messages={messages}
            profile={profile}
          />
          {chatUser && (
            <MessageInput
              input={input}
              setInput={setInput}
              mediaFile={mediaFile}
              setMediaFile={setMediaFile}
              setMediaFileBuffer={setMediaFileBuffer}
              sendMessage={sendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
