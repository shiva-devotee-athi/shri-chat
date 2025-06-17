import React from "react";
import { baseURL } from "@/api/axios.config";
import { FiPhone, FiVideo, FiMoreVertical, FiMenu } from "react-icons/fi";

export default function ChatHeader({
  chatUser,
  onMobileMenu,
}: {
  chatUser: IChatUserData | null;
  onMobileMenu: () => void;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-white/[0.05] border-stroke dark:border-strokedark p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={
            chatUser ? `${baseURL}${chatUser?.avatar}` : "/image/logo/logo.png"
          }
          alt="user"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-semibold text-black dark:text-white">
            {chatUser?.displayName || "Shri Chat"}
          </h4>
          {chatUser ? (
            <span className="text-xs text-green-500">
              Online
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Select user and chat your buddies
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-4 text-gray-400 dark:text-gray-300">
        <FiPhone className="cursor-pointer" />
        <FiVideo className="cursor-pointer" />
        <FiMoreVertical className="cursor-pointer" />
        <div className="md:hidden">
          <FiMenu className="cursor-pointer" onClick={onMobileMenu} />
        </div>
      </div>
    </div>
  );
}
