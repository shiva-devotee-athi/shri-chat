import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFolder = (type: string) => {
  switch (type) {
    case "image":
      return "images";
    case "audio":
      return "audio";
    case "video":
      return "video";
    case "document":
      return "documents";
    case "sticker":
      return "stickers";
    default:
      return "others";
  }
};