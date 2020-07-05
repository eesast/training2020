import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../configs/secret";
import { server } from "../configs/docker";
import { ServerToken } from "../models/room";

/**
 * Middleware: validate server authorizations; reject if necessary
 */
const checkServer = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).send("401 Unauthorized: Missing token");
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, secret) as ServerToken;
    if (decoded.server !== server) {
      return res.status(403).send("403 Forbidden: Permission denied");
    }
    req.body = {
      roomId: decoded.roomId,
      ...req.body,
    };
    req.auth = { id: 0 };
    next();
  } catch (err) {
    return res.status(401).send("401 Unauthorized: Wrong token");
  }
};

export default checkServer;
