"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const SiteSettings_1 = require("../models/SiteSettings");
// Default settings fallback
const DEFAULT_SETTINGS = {
    websiteName: "Eco Shine Bangladesh",
    phone: "01958-058359",
    email: "bdecoshine@gmail.com",
    whatsapp: "8801958058359",
    currency: "৳",
    deliveryChargeInside: 70,
    deliveryChargeOutside: 130,
    codEnabled: true,
    maintenanceMode: false,
};
const getSettings = async (req, res, next) => {
    try {
        let settings = await SiteSettings_1.SiteSettings.findOne({});
        if (!settings) {
            // Seed default settings dynamically if database is empty
            settings = await SiteSettings_1.SiteSettings.create(DEFAULT_SETTINGS);
        }
        res.status(200).json({ success: true, settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res, next) => {
    try {
        let settings = await SiteSettings_1.SiteSettings.findOne({});
        if (!settings) {
            settings = await SiteSettings_1.SiteSettings.create({ ...DEFAULT_SETTINGS, ...req.body });
        }
        else {
            settings = await SiteSettings_1.SiteSettings.findByIdAndUpdate(settings._id, req.body, {
                new: true,
                runValidators: true,
            });
        }
        res.status(200).json({ success: true, settings });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
