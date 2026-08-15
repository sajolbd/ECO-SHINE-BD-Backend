import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser";
import { AuthRequest } from "../middleware/auth";

export const seedAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Forbidden. Admin users already exist. Seeding is disabled.",
      });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const firstAdmin = await AdminUser.create({
      name,
      email,
      passwordHash,
      role: "super-admin",
    });

    res.status(201).json({
      success: true,
      message: "First Super Admin seeded successfully.",
      data: {
        id: firstAdmin._id,
        name: firstAdmin.name,
        email: firstAdmin.email,
        role: firstAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
    );

    // Set HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    const user = await AdminUser.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully." });
};
