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
    heroHeading: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroBadge: { type: String },
    heroButtonText: { type: String },
    heroButtonUrl: { type: String },
    heroDesktopImage: { type: String, required: true },
    heroMobileImage: { type: String, required: true },
    heroEnabled: { type: Boolean, default: true },
    featuredProducts: { type: [String], default: [] },
    featuredCategories: { type: [String], default: [] },
    whyChooseUs: { type: [WhyChooseUsSchema], default: [] },
    promotionalSections: { type: [PromotionalSectionSchema], default: [] },
}, { timestamps: true });
exports.Homepage = (0, mongoose_1.model)("Homepage", HomepageSchema);
