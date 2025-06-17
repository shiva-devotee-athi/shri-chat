import {
  UUID,
  UUIDV4,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../database/connection";
import Role from "./Role";
import Message from "./Message";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  async validPassword(password: any) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error: any) {
      throw new Error(`Method not implemented:${error}`);
    }
  }

  declare id: CreationOptional<string>;
  declare roleId?: ForeignKey<Role["id"]>;
  declare mainId: ForeignKey<User["id"]>;
  declare displayName: string;
  declare username: string;
  declare avatar?: string;
  declare password: string;
  declare roleName: string;
  declare countryCode: string;
  declare mobile: string;
  declare isActive?: boolean;
  declare isOnline: boolean;
}

User.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    mainId: {
      type: UUID,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { len: [3, 50] },
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
    timestamps: true,
  }
);

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

export default User;
