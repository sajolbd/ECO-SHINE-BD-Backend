import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser";
import { AuthRequest } from "../middleware/auth";

export const getAdminUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await AdminUser.find({}).select("-passwordHash").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Please provide name, email, password, and role." });
    }

    const exists = await AdminUser.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "An admin user with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    res.status(201).json({
      success: true,
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

export const updateAdminUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await AdminUser.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin user not found." });
    }

    if (email && email.toLowerCase() !== user.email) {
      const exists = await AdminUser.findOne({ email: email.toLowerCase() });
      if (exists) {
        return res.status(400).json({ success: false, message: "Email is already taken by another user." });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (role) {
      // Prevent editors or admins from downgrading super-admins
      if (user.role === "super-admin" && role !== "super-admin" && req.user?.role !== "super-admin") {
        return res.status(403).json({ success: false, message: "Only super-admins can alter super-admin privileges." });
      }
      user.role = role;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Admin user updated successfully.",
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

export const deleteAdminUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
    }

    const user = await AdminUser.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin user not found to delete." });
    }

    // Prevent deleting the last super-admin
    if (user.role === "super-admin") {
      const superAdminCount = await AdminUser.countDocuments({ role: "super-admin" });
      if (superAdminCount <= 1) {
        return res.status(400).json({ success: false, message: "You cannot delete the last Super Admin account." });
      }
    }

    await AdminUser.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Admin user deleted successfully." });
  } catch (error) {
    next(error);
  }
};
