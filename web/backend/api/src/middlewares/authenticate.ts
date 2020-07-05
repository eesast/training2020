import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../configs/secret";
import User, { UserModel, UserPublicToken } from "../models/user";

/**
 * Middleware: validate user authorizations; reject if necessary
 */
const authenticate: (
  acceptableRoles?: string[]
) => (req: Request, res: Response, next: NextFunction) => Response | void = (
  acceptableRoles
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send("401 Unauthorized: Missing token");
    }

    const token = authHeader.substring(7);
    return jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send("401 Unauthorized: Token expired or invalid");
      }

      let id = 0;
      const publicToken = decoded as UserPublicToken;
      const allowedEndpoints = publicToken.allowedEndpoints;
      if (allowedEndpoints) {
        const reqPath = req.baseUrl + req.route.path;
        const isValid = allowedEndpoints.reduce(
          (prev, cur) =>
            prev || (cur.path === reqPath && cur.methods.includes(req.method)),
          false
        );
        if (!isValid) {
          return res
            .status(403)
            .send("403 Forbidden: Public token is not allowed");
        }
        id = publicToken.id;
      } else {
        id = (decoded as UserModel).id;
      }

      User.findOne({ id }, { _id: 0, __v: 0, password: 0 }, (error, user) => {
        if (error) {
          return res.status(500).end();
        }
        if (!user) {
          return res.status(401).send("401 Unauthorized: Permission denied");
        }
        req.auth = { tokenValid: true, ...(user as any)._doc };
        // use authenticate() to accept all registered users
        if (!acceptableRoles || acceptableRoles.length === 0) {
          return next();
        }
        if (!acceptableRoles.includes(user.role)) {
          // leave it to next() to see if it indeed accesses `self`
          if (acceptableRoles.includes("self")) {
            req.auth.selfCheckRequired = true;
            return next();
          }

          return res.status(401).send("401 Unauthorized: Permission denied");
        }

        next();
      });
    });
  };
};

export default authenticate;
