import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import User from "@/models/User";
import { createJWT } from "@/functions/createJWT";
import {
  redisClient,
  saveForgetUserDetails,
  saveUserDataInRedis,
} from "@/functions/redisClient";
import Role from "@/models/Role";
import { generateOTP } from "@/utils/constants";

import bcrypt from "bcrypt";

interface RedisDataProps {
  countryCode: string;
  mobile: string;
  displayName: string;
  roleName?: string;
  avatar: string;
  hashedPassword: string;
  username: string;
  otp: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { countryCode, mobile, password, roleName, displayName, username } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarFile = req.file; // multer stores single file under req.file
    let avatarFilePath: string = "";

    if (avatarFile) {
      const originalFileName = avatarFile.originalname;
      const fileExtension = path.extname(originalFileName);
      const finalFileName = `${Date.now()}_${crypto.randomUUID()}${fileExtension}`;
      const folderPath = path.join(__dirname, "../../public/assets/avatar");

      // Ensure the folder exists
      await fs.promises.mkdir(folderPath, { recursive: true });

      // Absolute path to save the file
      const absolutePath = path.join(folderPath, finalFileName);

      // Save file
      await fs.promises.writeFile(absolutePath, avatarFile.buffer);

      // URL path to return/store
      avatarFilePath = `/assets/avatar/${finalFileName}`;
    }

    const alreadyUser = await User.findOne({
      where: {
        mobile: mobile,
      },
    });

    const redisCacheData = {
      username,
      displayName,
      countryCode,
      mobile,
      hashedPassword,
      roleName,
      avatar: avatarFilePath || "",
    };

    if (alreadyUser) {
      res.status(200).json({ message: "User Already exist", status: true });
    } else {
      const otp = generateOTP();
      saveUserDataInRedis({ ...redisCacheData, otp });
      res
        .status(201)
        .json({ message: "OTP Send Successfully", status: true, otp });
    }
  } catch (error) {
    console.error("Error Happens OTP Send", error);
    res.status(500).json({
      message: "Error Happens OTP Send",
      status: false,
    });
  }
};

export const verifyOTPRegistration = async (req: Request, res: Response) => {
  try {
    const { otp, mobile, countryCode } = req.body;
    const otp_data = await redisClient.get(`user_${mobile}`);

    if (!otp_data) {
      res
        .status(400)
        .json({ message: "OTP expired or invalid", status: false });
      return;
    }

    const {
      countryCode: otp_cc,
      mobile: otp_mobile,
      hashedPassword,
      otp: one_time_password,
      displayName,
      roleName,
      avatar,
      username,
    }: RedisDataProps = JSON.parse(otp_data);

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      res.status(400).json({
        message: "Username already exists",
        status: false,
      });
      return;
    }

    if (otp !== one_time_password) {
      res.status(400).json({ message: "Invalid OTP", status: false });
      return;
    }

    const roleData = await Role.findOne({
      where: { roleName: roleName },
    });
    const monitorData = await User.findOne({
      where: { roleName: "MONITOR" },
    });

    const roleId = roleData?.id;
    const monitorId = monitorData?.id;

    await User.create({
      countryCode: otp_cc,
      mobile: otp_mobile,
      avatar: avatar,
      displayName: displayName,
      username: username,
      password: hashedPassword,
      roleName: roleName || "",
      roleId,
      isActive: true,
      isOnline: false,
    }).then(async (data) => {
      await data.update({ mainId: monitorId });
      res
        .status(201)
        .json({ message: "User Created Successfully", status: true, data });
    });
  } catch (error) {
    console.error("Error verifying OTP", error);
    res.status(500).json({ message: "Error verifying OTP", status: false });
  }
};

export const loginMonitor = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;
    const userData = await User.findOne({
      where: {
        mobile,
        roleName: "MONITOR",
      },
    });

    if (userData) {
      if (userData.isActive === true) {
        var validPassword = await userData.validPassword(password);
        if (validPassword) {
          var token = createJWT(
            userData.username,
            userData.countryCode,
            userData.mobile,
            userData.id,
            userData.mainId
          );
          res.status(200).json({
            message: "Logged in successfully",
            token: token,
            status: true,
          });
        } else {
          res.status(200).json({ message: "Password Mismatch", status: false });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Monitor Inactive Please Check",
        });
      }
    } else {
      res.status(200).json({
        message: "Monitor Not exist please Register",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error Happens While Login", error);
    res
      .status(500)
      .json({ message: "Error Happens While Login", status: false });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    const userData = await User.findOne({
      where: {
        mobile,
        roleName: "USER",
      },
    });

    if (userData) {
      if (userData.isActive === true) {
        var validPassword = await userData.validPassword(password);
        if (validPassword) {
          var token = createJWT(
            userData.username,
            userData.countryCode,
            userData.mobile,
            userData.id,
            userData.mainId
          );
          res.status(200).json({
            message: "Logged in successfully",
            token: token,
            status: true,
          });
        } else {
          res.status(200).json({ message: "Password Mismatch", status: false });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "User Inactive Please Contact Monitor Team",
        });
      }
    } else {
      res
        .status(200)
        .json({ message: "User Not exist please Register", status: false });
    }
  } catch (error) {
    console.error("Error Happens While Login", error);
    res
      .status(500)
      .json({ message: "Error Happens While Login", status: false });
  }
};

export const forgetPasswordOTPSend = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;

    const userData = await User.findOne({
      where: { mobile },
    });

    if (!userData) {
      res
        .status(200)
        .json({ message: `user data not available`, status: true });
      return;
    }

    const otp = generateOTP();
    saveForgetUserDetails(mobile, otp);

    res.status(200).json({
      message: "send OTP successfully",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error on search users", status: false });
  }
};

export const verifyOTPforgetPass = async (req: Request, res: Response) => {
  try {
    const { otp, mobile } = req.body;
    const otp_data = await redisClient.get(`user_fp_${mobile}`);

    if (!otp_data) {
      res
        .status(400)
        .json({ message: "OTP expired or invalid", status: false });
      return;
    }

    const { mobile: otp_mobile, otp: one_time_password }: RedisDataProps =
      JSON.parse(otp_data);

    if (otp !== one_time_password) {
      res.status(400).json({ message: "Invalid OTP", status: false });
      return;
    }

    const userData = await User.findOne({
      where: { mobile: mobile },
    });

    if (!userData) {
      res
        .status(200)
        .json({ message: "User Not exist please Register", status: false });
      return;
    }

    const token = createJWT(
      userData.username,
      userData.countryCode,
      userData.mobile,
      userData.id,
      userData.mainId
    );
    res
      .status(201)
      .json({ message: "OTP verified Successfully", status: true, token });
  } catch (error) {
    console.error("Error verifying OTP", error);
    res.status(500).json({ message: "Error verifying OTP", status: false });
  }
};
