"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AdminUser_1 = require("../models/AdminUser");
const seedAdmin = async (req, res, next) => {
    try {
        const adminCount = await AdminUser_1.AdminUser.countDocuments();
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
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const firstAdmin = await AdminUser_1.AdminUser.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.seedAdmin = seedAdmin;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }
        const user = await AdminUser_1.AdminUser.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const secret = process.env.JWT_SECRET || "fallback_secret_key";
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") });
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authenticated." });
        }
        const user = await AdminUser_1.AdminUser.findById(req.user.id).select("-passwordHash");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully." });
};
exports.logout = logout;
