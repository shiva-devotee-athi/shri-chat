import { useAppDispatch } from "@/store/hook";
import { logout } from "@/store/slices/userSlice";
import React from "react";
import { Link } from "react-router";

const UserHeader: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header className="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 dark:bg-orange-800 dark:border-orange-700 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-4">
        <div className="relative flex items-center">
          <a href="/">
            <img
              src="/image/logo/logo.png"
              loading="lazy"
              style={{ color: "transparent" }}
              className="rounded-full"
              width="32"
              height="32"
            />
          </a>
        </div>
        <ul className="hidden items-center justify-center gap-6 md:flex text-slate-700 dark:text-slate-100">
          <li className="pt-1.5 font-dm text-sm font-medium">
            <Link to="/user/contact">Contacts</Link>
          </li>
          <li className="pt-1.5 font-dm text-sm font-medium">
            <Link to="/user/chat">Chat</Link>
          </li>
          <li className="pt-1.5 font-dm text-sm font-medium">
            <Link to="/user/doc">Docs</Link>
          </li>
        </ul>
        <div className="flex-grow"></div>
        <div className="hidden items-center justify-center gap-6 md:flex">
          <button
            onClick={handleLogout}
            className="rounded-md bg-gradient-to-br from-green-600 to-emerald-400 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md shadow-green-400/50 transition-transform duration-200 ease-in-out hover:scale-[1.03]"
          >
            Logout
          </button>
        </div>
        <div className="relative flex items-center justify-center md:hidden">
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-auto text-slate-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default UserHeader;
