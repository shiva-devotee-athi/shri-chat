import { format } from "date-fns";
import MediaImageUI, {
  MediaAudioUI,
  MediaDocumentUI,
  MediaVideoUI,
} from "./media/MediaMessage";
import { useEffect, useRef } from "react";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string | null;
  fileurl?: string | null;
  messageType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | "STICKER";
  updatedAt: string;
  createdAt: string;
}

export default function ChatMessages({
  messages,
  chatUser,
  profile,
}: {
  messages: Message[];
  chatUser: IChatUserData | null;
  profile: IChatUserData;
}) {
  const chatMessageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatMessageContainerRef.current) {
      return;
    }
    // chatMessageContainerRef.current.scrollTop = chatMessageContainerRef.current.scrollHeight;
    chatMessageContainerRef.current.scrollTo({
      top: chatMessageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4"
      ref={chatMessageContainerRef}
    >
      {messages.map((msg, i) => {
        return (
          <div
            key={i}
            className={`flex ${
              msg.senderId === profile.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm  bg-[#F1F5F9] text-gray-500 text-start  dark:text-gray-400 ${
                msg.senderId === profile.id
                  ? "rounded-br-none dark:bg-[#641c00]"
                  : " rounded-bl-none dark:bg-white/[0.03]"
              }`}
            >
              {msg.fileurl && (
                <div>
                  {msg.messageType == "IMAGE" && (
                    <MediaImageUI fileurl={msg.fileurl} />
                  )}

                  {msg.messageType == "AUDIO" && (
                    <MediaAudioUI fileurl={msg.fileurl} />
                  )}
                  {msg.messageType == "VIDEO" && (
                    <MediaVideoUI fileurl={msg.fileurl} />
                  )}
                  {msg.messageType == "DOCUMENT" && (
                    <MediaDocumentUI fileurl={msg.fileurl} />
                  )}
                </div>
              )}

              {msg.content}
              <div className="text-[10px] text-right mt-1 opacity-70">
                {format(msg.createdAt, "hh:mm aaa")}
              </div>
            </div>
          </div>
        );
      })}

      {!chatUser && (
        <div className="text-center">
          <p className="text-yellow-400 text-base font-normal mb-3 tracking-widest uppercase">
            chat with us
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-white my-2">
            Explore Chat Experience Here.
          </h3>
          <p className="text-black/50 dark:text-white/50 text-sm font-normal mb-10 text-center mt-2">
            A real-time chat application is a software application that enables
            users to exchange messages and communicate with each other in
            real-time.{" "}
          </p>
          <img
            alt="hero-image"
            loading="lazy"
            width="800"
            height="642"
            className="w-full max-w-2xs rounded-2xl mx-auto"
            src="/image/avatar/banner.svg"
          ></img>
        </div>
      )}
    </div>
  );
}
