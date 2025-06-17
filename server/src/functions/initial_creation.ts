import User from "../models/User";
import Role from "../models/Role";
import bcrypt from "bcrypt";

export const createMonitor = async (roleId: string) => {
  try {
    const monitor_mobile = process.env.MONITOR_MOBILE || "";
    const monitor_password = process.env.MONITOR_PASSWORD || "";
    const existingData = await User.findOne({
      where: { mobile: monitor_mobile },
    });
    if (existingData) {
      console.info("roles already created");
      return;
    }
    const hashedPassword = await bcrypt.hash(monitor_password, 10);

    const user_data = await User.create({
      username:'vj_monitor',
      displayName:'Admin Monitor',
      avatar:'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/75.jpg',
      password: hashedPassword,
      mobile: monitor_mobile,
      countryCode: "91",
      roleName: "MONITOR",
      roleId: roleId,
      isOnline: false,
    });

    if (user_data) {
      await user_data.update({ mainId: user_data.id });
      console.info(`Monitor Created Successfully`);
    } else {
      console.info(`Monitor Already Exist`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createRole = async () => {
  try {
    const existingRoles = await Role.findAll({
      where: { roleName: ["MONITOR", "USER"] },
    });

    if (existingRoles.length == 2) {
      console.info("roles already created");
      return;
    }
    const roles = [
      {
        roleName: "MONITOR",
        title: "App Monitor",
      },
      {
        roleName: "USER",
        title: "User",
      },
    ];

    for (const role of roles) {
      const [roleData, alreadyCreated] = await Role.findCreateFind({
        where: { roleName: role.roleName },
        defaults: role,
      });

      if (alreadyCreated) {
        console.info(`${role.roleName} Created Successfully`);

        if (role.roleName === "MONITOR") {
          createMonitor(roleData.dataValues.id);
        }
      } else {
        console.info(`${role.roleName} Already Exist`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
