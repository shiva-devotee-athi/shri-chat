// require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import JSONWebToken from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import { MiddlewareRequest } from "../types/express";

dotenv.config();

export const isUser = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["authorization"]) {
      res.status(403).send({
        status: false,
        message: "No token provided.",
      });
      return;
    }

    const token = req.headers["authorization"].split(" ")[1];
    const decodeToken: any = JSONWebToken.verify(
      token,
      process.env.JWT_SECRET || ""
    );

    const myUser = await User.findOne({
      where: { id: decodeToken.id },
    });
    if (myUser && myUser.isActive == true) {
      if (myUser && myUser.roleName == "USER") {
        req.id = decodeToken.id;
        req.mainId = myUser.mainId;
        req.roleName = myUser.roleName;
        next();
      } else {
        res.status(401).json({ status: false, message: "Invalid user" });
      }
    } else {
      res.status(401).json({ status: false, message: "User Inactive" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Invalid token or token expires" });
  }
};
