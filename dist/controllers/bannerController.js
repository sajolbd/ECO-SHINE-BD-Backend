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
        // Check if default banners exist, if not seed them
        const defaultCheck = await Banner_1.Banner.findOne({ title: "Tank Guard Cleaning Solution" });
        if (!defaultCheck) {
            const defaultBanners = [
                {
                    title: "Tank Guard Cleaning Solution",
                    subtitle: "Water Tank Care",
                    ctaText: "Best Seller",
                    url: "/#products",
                    imageDesktop: "/images/products/product-1.jpeg",
                    imageMobile: "/images/products/product-1.jpeg",
                    isActive: true,
                    displayOrder: 1,
                },
                {
                    title: "Kitchen & Tiles Cleaner",
                    subtitle: "Grease & Tile Care",
                    ctaText: "Top Rated",
                    url: "/#products",
                    imageDesktop: "/images/products/product-2.jpeg",
                    imageMobile: "/images/products/product-2.jpeg",
                    isActive: true,
                    displayOrder: 2,
                },
                {
                    title: "Bubble Boss Foaming Gel",
                    subtitle: "Auto Detailing & Wash",
                    ctaText: "Popular",
                    url: "/#products",
                    imageDesktop: "/images/products/product-3.jpeg",
                    imageMobile: "/images/products/product-3.jpeg",
                    isActive: true,
                    displayOrder: 3,
                },
                {
                    title: "Bubble Boss Colour Guard",
                    subtitle: "Car & Bike Care",
                    ctaText: "Featured",
                    url: "/#products",
                    imageDesktop: "/images/products/product-4.jpeg",
                    imageMobile: "/images/products/product-4.jpeg",
                    isActive: true,
                    displayOrder: 4,
                },
                {
                    title: "Bubble Boss Foaming Gel (550ml)",
                    subtitle: "Colour Guard Wash",
                    ctaText: "Hot Deal",
                    url: "/#products",
                    imageDesktop: "/images/products/product-5.jpeg",
                    imageMobile: "/images/products/product-5.jpeg",
                    isActive: true,
                    displayOrder: 5,
                },
                {
                    title: "Premium Car & Bike Wax",
                    subtitle: "Shine & Paint Protection",
                    ctaText: "Eco Choice",
                    url: "/#products",
                    imageDesktop: "/images/products/product-6.jpeg",
                    imageMobile: "/images/products/product-6.jpeg",
                    isActive: true,
                    displayOrder: 6,
                },
                {
                    title: "Bubble Boss Foaming Gel Combo",
                    subtitle: "Foam Wash Special",
                    ctaText: "Combo wash",
                    url: "/#products",
                    imageDesktop: "/images/products/product-7.jpeg",
                    imageMobile: "/images/products/product-7.jpeg",
                    isActive: true,
                    displayOrder: 7,
                },
                {
                    title: "Bubble Boss Foaming Gel (250ml)",
                    subtitle: "Auto Care Essentials",
                    ctaText: "Best wash",
                    url: "/#products",
                    imageDesktop: "/images/products/product-8.jpeg",
                    imageMobile: "/images/products/product-8.jpeg",
                    isActive: true,
                    displayOrder: 8,
                }
            ];
            await Banner_1.Banner.insertMany(defaultBanners);
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
