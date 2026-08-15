"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const mongoose_1 = require("mongoose");
const AboutSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    mission: { type: String },
    vision: { type: String },
    highlights: { type: [String], default: [] },
    ctaText: { type: String },
    ctaLink: { type: String },
}, { timestamps: true });
exports.About = (0, mongoose_1.model)("About", AboutSchema);
