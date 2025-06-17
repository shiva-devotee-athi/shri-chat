import { useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";
import MediaFilePanel from "./media/MediaFilePanel";
import { Buffer } from "buffer";
import { toast } from "react-toastify";

export default function MessageInput({
  input,
  setInput,
  mediaFile,
  setMediaFile,
  setMediaFileBuffer,
  sendMessage,
}: {
  input: string;
  mediaFile: File | null;
  setInput: (v: string) => void;
  setMediaFile: (v: File) => void;
  setMediaFileBuffer: (v: Buffer) => void;
  sendMessage: ({ type, messageType }: ISendMediaMessageProps) => void;
}) {
  const [fileOption, setFileOption] = useState(false);
  const [msgType, setMsgType] = useState<MessageType>("TEXT");
  const fileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileRef.current && !fileRef.current.contains(event.target as Node)) {
        handleFileDropdownClose(); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileDropdownOpen = () => {
    setFileOption(true);
  };

  const handleFileDropdownClose = () => {
    setFileOption(false);
  };

  const handleSelectFile = (file: File,type:MessageType) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.info("File Size Exceed 10mb. Compress or Change File.")
      return
    }

    setMediaFile(file);
    setMsgType(type)
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);
        setMediaFileBuffer(buffer);
      }
    };

    reader.readAsArrayBuffer(file);
    handleFileDropdownClose();
  };

  return (
    <>
      <MediaFilePanel mediaFile={mediaFile} />
      <div className="border-t border-gray-200 dark:border-white/[0.05] border-stroke dark:border-strokedark p-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-md border border-gray-200 dark:border-white/[0.05] border-stroke dark:border-strokedark dark:bg-form-input dark:text-white focus:outline-none"
        />

        <div
          className="flex relative"
          onClick={handleFileDropdownOpen}
          ref={fileRef}
        >
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 p-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300`}
          >
            <FiPaperclip size={18} color="white" />
          </button>
          <div
            id="dropdownDelay"
            className={`${
              fileOption ? "block" : "hidden"
            } z-10 absolute right-2 bottom-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDelayButton"
            >
              <li>
                <button
                  onClick={() => {
                    document.getElementById("document-input")?.click();
                    handleFileDropdownClose();
                  }}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Document
                </button>
                <input
                  type="file"
                  accept=".pdf, .doc, .docx, .txt"
                  hidden
                  id="document-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSelectFile(e.target.files[0],"DOCUMENT");
                    }
                  }}
                />
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById("audio-input")?.click();
                    handleFileDropdownClose();
                  }}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Audio
                </button>
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  id="audio-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSelectFile(e.target.files[0],"AUDIO");
                    }
                  }}
                />
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById("video-input")?.click();
                  }}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Video
                </button>
                <input
                  type="file"
                  accept="video/mp4,video/x-m4v,video/*"
                  hidden
                  id="video-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSelectFile(e.target.files[0],"VIDEO");
                    }
                  }}
                />
              </li>
              <li>
                <button
                  onClick={() => {
                    handleFileDropdownClose();
                    document.getElementById("image-input")?.click();
                  }}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="image-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSelectFile(e.target.files[0],"IMAGE");
                    }
                  }}
                />
              </li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mediaFile) {
              sendMessage({ type: "MEDIA", messageType: msgType as MessageType });
            } else {
              sendMessage({ type: "TEXT", messageType: "TEXT" });
            }
          }}
          className={`inline-flex items-center justify-center gap-2 p-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300`}
        >
          <FiSend size={18} color="white" />
        </button>
      </div>
    </>
  );
}
