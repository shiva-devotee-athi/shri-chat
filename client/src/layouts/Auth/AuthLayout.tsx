import Header from "@/pages/header/Header";
import React from "react";
// import "@/styles/scss/auth.scss";
import { Outlet } from "react-router";

const AuthLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
