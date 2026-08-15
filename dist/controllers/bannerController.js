"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBanners = void 0;
const Banner_1 = require("../models/Banner");
const getBanners = async (req, res, next) => {
    try {
        const { activeOnly } = req.query;
        const query = {};
        if (activeOnly === "true") {
            query.isActive = true;
        }
        const banners = await Banner_1.Banner.find(query).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, banners });
    }
    catch (error) {
        next(error);
    }
};
exports.getBanners = getBanners;
const createBanner = async (req, res, next) => {
    try {
        const banner = await Banner_1.Banner.create(req.body);
        res.status(201).json({ success: true, banner });
    }
    catch (error) {
        next(error);
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const banner = await Banner_1.Banner.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found." });
        }
        res.status(200).json({ success: true, banner });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const banner = await Banner_1.Banner.findByIdAndDelete(id);
        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found." });
        }
        res.status(200).json({ success: true, message: "Banner deleted successfully." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBanner = deleteBanner;
