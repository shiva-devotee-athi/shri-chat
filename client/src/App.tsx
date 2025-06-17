import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "@/layouts/Auth/AuthLayout.tsx";
import Login from "@/pages/auth/Login.tsx";
import Register from "@/pages/auth/Register.tsx";
import HomeLayout from "@/layouts/home/HomeLayout.tsx";
import Users from "./pages/user/Users";
import Chat from "@/pages/chat";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppDispatch } from "./store/hook";
import { login } from "./store/slices/userSlice";
import DocumentMessage from "./pages/docs/DocumentMessage";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      dispatch(login({ token, role: "USER" }));
    }
  }, []);
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="user" element={<HomeLayout />}>
          <Route path="contact" element={<Users />} />
          <Route path="chat" element={<Chat />} />
          <Route path="doc" element={<DocumentMessage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
