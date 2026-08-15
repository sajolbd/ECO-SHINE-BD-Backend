"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUser = void 0;
const mongoose_1 = require("mongoose");
const AdminUserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ["super-admin", "admin", "editor"],
        default: "admin",
        required: true,
    },
}, { timestamps: true });
exports.AdminUser = (0, mongoose_1.model)("AdminUser", AdminUserSchema);
