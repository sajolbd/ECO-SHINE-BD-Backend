"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
const mongoose_1 = require("mongoose");
const SiteSettingsSchema = new mongoose_1.Schema({
    websiteName: { type: String, default: "Eco Shine Bangladesh", required: true },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    primaryColor: { type: String, default: "#3AA833" },
    secondaryColor: { type: String, default: "#000000" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    currency: { type: String, default: "৳", required: true },
    deliveryChargeInside: { type: Number, default: 70, required: true },
    deliveryChargeOutside: { type: Number, default: 130, required: true },
    codEnabled: { type: Boolean, default: true, required: true },
    maintenanceMode: { type: Boolean, default: false, required: true },
}, { timestamps: true });
exports.SiteSettings = (0, mongoose_1.model)("SiteSettings", SiteSettingsSchema);
