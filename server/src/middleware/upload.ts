// src/middleware/upload.ts
import { getFolder } from "@/utils/constants";
import multer from "multer";
import path from "path";


const storage = multer.memoryStorage(); // This stores files as Buffer in `req.file.buffer`

export const upload = multer({ storage });
