"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    businessHours: { type: String, required: true },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    otherSocialLinks: { type: Map, of: String, default: new Map() },
}, { timestamps: true });
exports.Contact = (0, mongoose_1.model)("Contact", ContactSchema);
