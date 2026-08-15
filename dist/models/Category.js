"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active", required: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
exports.Category = (0, mongoose_1.model)("Category", CategorySchema);
