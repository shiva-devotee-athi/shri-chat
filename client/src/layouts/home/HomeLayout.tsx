import UserHeader from "@/pages/header/UserHeader";
import React from "react";
import { Outlet } from "react-router";
// import "@/styles/scss/homepage.scss";

const HomeLayout: React.FC = () => {
  return (
    <>
      <UserHeader />
      <main className="w-full">
        <Outlet />
      </main>
      {/* <Footer/> */}
    </>
  );
};

export default HomeLayout;
