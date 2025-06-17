import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  id: string;
  mainId: string;
  email: string;
  role: "ADMIN" | "USER" | "SUPERADMIN";
}

export const storeAuthInCookies = (user: {
  token: string;
  role: string;
}) => {
  Cookies.set("token", user.token, { secure: true });
  Cookies.set("role", user.role, { secure: true });
};

export const storeInstanceInCookies = (user: {
  profileimage: string | null;
  userId: string;
  instance_id: string;
  display_name: string;
  verified_mobile: string;
}) => {
  const data = JSON.stringify(user);
  Cookies.set(user.userId, data, { secure: true });
};

export const getInstanceFromCookies = () => {
  const token = Cookies.get("refreshToken");
  if (!token) {
    return null;
  }

  const decoded = jwtDecode<ExtendedJwtPayload>(token);
  const data = Cookies.get(decoded.id);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse instance data from cookies", e);
    return null;
  }
};

export const clearAuthCookies = () => {
  Cookies.remove("token");
  Cookies.remove("role");
};
