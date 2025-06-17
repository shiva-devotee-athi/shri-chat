export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 6-digit OTP
};


export const getFolder = (type: string) => {
  switch (type) {
    case "image":
      return "images";
    case "audio":
      return "audios";
    case "video":
      return "videos";
    case "document":
      return "documents";
    case "sticker":
      return "stickers";
    default:
      return "others";
  }
};