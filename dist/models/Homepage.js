"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Homepage = void 0;
const mongoose_1 = require("mongoose");
const WhyChooseUsSchema = new mongoose_1.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
});
const PromotionalSectionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
});
const HomepageSchema = new mongoose_1.Schema({
    heroHeading: { type: String, default: "Shine Your World With Eco Shine" },
    heroDescription: { type: String, default: "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।" },
    heroBadge: { type: String, default: "Bangladesh's #1 Eco-Shine & Renovation Hub" },
    heroButtonText: { type: String, default: "প্রোডাক্ট দেখুন" },
    heroButtonUrl: { type: String, default: "#products" },
    heroDesktopImage: { type: String, default: "/images/home/hero/hero-bg.png" },
    heroMobileImage: { type: String, default: "/images/home/hero/hero-bg-mobile.png" },
    heroEnabled: { type: Boolean, default: true },
    announcements: { type: [String], default: [] },
    featuredProducts: { type: [String], default: [] },
    featuredCategories: { type: [String], default: [] },
    whyChooseUs: { type: [WhyChooseUsSchema], default: [] },
    promotionalSections: { type: [PromotionalSectionSchema], default: [] },
}, { timestamps: true });
exports.Homepage = (0, mongoose_1.model)("Homepage", HomepageSchema);
