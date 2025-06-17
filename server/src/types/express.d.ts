import { Request } from "express";

export interface MiddlewareRequest extends Request {
  id?: string;
  mainId?: string;
  roleName?: string;
}
