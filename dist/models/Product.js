"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, default: 0, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 100 },
    images: { type: [String], required: true, default: [] },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    unit: { type: String, required: true },
    badge: { type: String },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    howToUse: [
        {
            step: { type: Number },
            title: { type: String },
            desc: { type: String },
        },
    ],
    specifications: [
        {
            key: { type: String },
            value: { type: String },
        },
    ],
    faqs: [
        {
            question: { type: String },
            answer: { type: String },
        },
    ],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 99 },
    status: { type: String, enum: ["active", "inactive"], default: "active", required: true, index: true },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
