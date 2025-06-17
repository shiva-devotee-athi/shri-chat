import User from "@/models/User";
import { MiddlewareRequest } from "@/types/express";
import { Response } from "express";

export const viewUserDetails = async (
  req: MiddlewareRequest,
  res: Response
) => {
  try {
    const userId = req?.id;
    const role = req?.roleName;
    const userData = await User.findAll({
      where: { roleName: role },
    });
    if (!userData) {
      res.status(200).json({
        message: `User details not Exist`,
        status: false,
      });
      return;
    }

    res.status(200).json({
      message: "success",
      data: userData,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error on get Address", status: false });
  }
};

export const viewUserDetailList = async (
  req: MiddlewareRequest,
  res: Response
) => {
  try {
    const role = req?.roleName;
    const userData = await User.findAll({
      where: { roleName: role },
      attributes: [
        "id",
        "displayName",
        "username",
        "countryCode",
        "mobile",
        "avatar",
        "updatedAt",
      ],
    });
    if (!userData) {
      res.status(200).json({
        message: `User details not Exist`,
        status: false,
      });
      return;
    }

    res.status(200).json({
      message: "success",
      data: userData,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error on get Address", status: false });
  }
};
