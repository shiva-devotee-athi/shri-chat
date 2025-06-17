export interface ITextMessageReq {
  senderId:string;
  receiverId:string;
  content:string|null;
  messageType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | "STICKER";
  fileName:string;
  fileBuffer:Buffer;
}

export interface IMediaFileReq {
  senderId: string;
  receiverId: string;
  content: string | null;
  messageType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | "STICKER";
  fileName: string;
  fileBuffer: Buffer;
}
