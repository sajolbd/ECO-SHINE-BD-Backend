"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const BannerSchema = new mongoose_1.Schema({
    title: { type: String },
    subtitle: { type: String },
    ctaText: { type: String },
    url: { type: String },
    imageDesktop: { type: String, required: true },
    imageMobile: { type: String, required: true },
    isActive: { type: Boolean, default: true, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
exports.Banner = (0, mongoose_1.model)("Banner", BannerSchema);
