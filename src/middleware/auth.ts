import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "super-admin" | "admin" | "editor";
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check Authorization header or cookies
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated. Authorization token missing." });
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: "super-admin" | "admin" | "editor";
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export const requireRole = (allowedRoles: ("super-admin" | "admin" | "editor")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized for this resource.`,
      });
    }

    next();
  };
};
