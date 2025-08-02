import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/index";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
export function Middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }


  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if(typeof decoded != "object"){
        return;
    }

    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(401).json({ msg: "Invalid token payload" });
    }
  } catch (err) {
    return res.status(403).json({ msg: "Unauthorized: invalid or expired token" });
  }
}
