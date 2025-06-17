type MessageType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | "STICKER";


interface IChatUserData {
  id: string;
  avatar: string;
  displayName: string;
  username: string;
  countryCode: string;
  mobile: string;
  updatedAt: string;
  receivedMessages: IReceiverMessageData[];
  sentMessages: ISenderMessageData[];
}

interface IReceiverMessageData {
  senderId: string;
  content: string | null;
  createdAt: string;
}

interface ISenderMessageData {
  receiverId: string;
  content: string | null;
  createdAt: string;
}

interface ISendMediaMessageProps {
  type: "TEXT" | "MEDIA";
  messageType: MessageType;
}
