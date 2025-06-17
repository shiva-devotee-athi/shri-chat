import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

const connectiondDB = () => {
  sequelize
    .authenticate()
    .then(() => console.log("connected successfully"))
    .catch((err) => {
      console.error("err" + err);
    });
};

const syncDB = () => {
  sequelize.sync({ alter: true, force: false }).then(() => {
    console.log("resync the data successfully");
  });
};

// module.exports = { syncDB, connectiondDB, sequelize };
export { syncDB, connectiondDB, sequelize };
