import {
  UUID,
  UUIDV4,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ForeignKey,
} from "sequelize";
import { sequelize } from "@/database/connection";
import User from "./User";

export class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: CreationOptional<string>;
  declare senderId: ForeignKey<User["id"]>;
  declare receiverId: ForeignKey<User["id"]>;
  declare messageType: string;
  declare content: string|null;
  declare fileurl: string | null;
}

Message.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    senderId: {
      type: UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    receiverId: {
      type: UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    messageType: {
      type: DataTypes.ENUM(
        "TEXT",
        "IMAGE",
        "AUDIO",
        "VIDEO",
        "DOCUMENT",
        "STICKER"
      ),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "message",
    tableName: "messages",
    timestamps: true,
  }
);

export default Message;
