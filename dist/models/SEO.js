"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEO = void 0;
const mongoose_1 = require("mongoose");
const SEOSchema = new mongoose_1.Schema({
    pageName: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    robots: { type: String, default: "index, follow" },
}, { timestamps: true });
exports.SEO = (0, mongoose_1.model)("SEO", SEOSchema);
