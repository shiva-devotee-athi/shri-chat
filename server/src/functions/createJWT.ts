import JSONWebToken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export type jwtSignArg = {
  username?: string | undefined;
  mobile: string;
  countryCode: string;
  id: string;
  mainId: string;
};
const createJWT = (
  username: string | undefined,
  countryCode: string,
  mobile: string,
  id: string,
  mainId: string
) => {
  const token = JSONWebToken.sign(
    { username, countryCode, mobile, id, mainId },
    process.env.JWT_SECRET || "",
    { expiresIn: "7d" }
  );

  return token;
};

export { createJWT };
