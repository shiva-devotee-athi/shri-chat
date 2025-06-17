import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow, isThisWeek, isToday } from "date-fns";
import { baseURL } from "@/api/axios.config";

// const users = [
//   {
//     name: "Kaiya George",
//     role: "Project Manager",
//     time: "15 mins",
//     avatar: "/images/user/user-01.jpg",
//   },
//   {
//     name: "Lindsey Curtis",
//     role: "Designer",
//     time: "30 mins",
//     avatar: "/images/user/user-02.jpg",
//   },
//   {
//     name: "Zain Geidt",
//     role: "Content Writer",
//     time: "45 mins",
//     avatar: "/images/user/user-03.jpg",
//   },
// ];

export default function ChatSidebar({
  users,
  profile,
  isOpen,
  setIsOpen,
  handleChatUser,
}: {
  users: IChatUserData[];
  profile: IChatUserData | null;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  handleChatUser: (v: IChatUserData) => void;
}) {
  const [latestMessages, setLatestMessages] = useState({});

  // useEffect(() => {
  //   // Fetch latest messages for each user (pseudo)
  //   fetch(`/api/messages/last?userId=${currentUserId}`)
  //     .then((res) => res.json())
  //     .then(setLatestMessages);
  // }, []);

  // const msg = latestMessages[user.id];

  const getLastMessage = (chatUser: IChatUserData) => {
    const allMessages = [
      ...chatUser.sentMessages,
      ...chatUser.receivedMessages,
    ];

    if (allMessages.length === 0) return null;

    return allMessages.reduce((latest, msg) =>
      new Date(msg.createdAt) > new Date(latest.createdAt) ? msg : latest
    );
  };

  const formatMessageDate = (dateString: string): string => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, "hh:mm aaa"); // Example: 10:30 AM
    } else if (isThisWeek(date)) {
      return format(date, "EEE"); // Example: Mon, Tue, Fri
    } else {
      return format(date, "dd-MM-yyyy"); // Example: 10-06-2025
    }
  };

  return (
    <div
      className={`fixed md:static top-0 left-0 z-50 h-full w-64 md:w-1/3 lg:w-1/4 overflow-hidden rounded-xl border border-gray-200  dark:border-white/[0.05] bg-white dark:bg-[#191919] border-r border-stroke dark:border-strokedark shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="flex justify-between items-center p-4 md:hidden">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Chats
        </h2>
        <button onClick={() => setIsOpen(false)}>
          <span className="text-xl text-black dark:text-white">×</span>
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        <div className="flex items-center mb-4 gap-3">
          <img
            src={`${baseURL}${profile?.avatar}`}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-black dark:text-white">
              {profile?.displayName ?? ""}
            </h4>
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Qidirish"
          className="w-full px-3 py-2  dark:bg-dark-900 h-11 rounded-lg border border-gray-200 bg-transparent  text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 "
        />
        <div className="mt-4 space-y-4">
          {users.map((user, i) => {
            // const msg = latestMessages[user.id];
            const lastMessage = getLastMessage(user);
            return (
              <div
                key={i}
                onClick={() => handleChatUser(user)}
                className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/[0.1] p-2 rounded-md cursor-default"
              >
                <img
                  src={`${baseURL}${user?.avatar}`}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="avatar"
                />
                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-0.5">
                    <h4 className="text-sm truncate font-semibold text-gray-500 text-start  dark:text-gray-400">
                      {user.displayName}
                    </h4>
                    <span className=" text-xs text-gray-400 w-max ms-1">
                      {lastMessage?.createdAt
                        ? formatMessageDate(lastMessage?.createdAt)
                        : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                    {lastMessage?.content ||
                      user.countryCode + "" + user.mobile}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
