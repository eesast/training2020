import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../configs/secret";
import { UserModel } from "../models/user";

/**
 * Middleware: only check token status; does not reject
 */
const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.auth = {
      tokenValid: false,
    };
    return next();
  }

  const token = authHeader.substring(7);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      req.auth = {
        tokenValid: false,
      };
      return next();
    }

    const user = decoded as UserModel;
    req.auth = {
      tokenValid: true,
      ...user,
    };
    next();
  });
};

export default checkToken;
