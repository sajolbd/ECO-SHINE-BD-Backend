"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.getMedia = exports.uploadMedia = void 0;
const Media_1 = require("../models/Media");
const cloudinary_1 = require("../config/cloudinary");
const uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please select an image file to upload." });
        }
        let url = "";
        let publicId = "";
        let format = req.file.mimetype.split("/")[1] || "jpeg";
        let sizeBytes = req.file.size;
        // Check if Cloudinary credentials are provided in env
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            try {
                const cloudRes = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer);
                url = cloudRes.url;
                publicId = cloudRes.publicId;
                format = cloudRes.format;
                sizeBytes = cloudRes.sizeBytes;
            }
            catch (err) {
                console.error("Cloudinary upload failed, falling back to local base64:", err);
            }
        }
        if (!url) {
            const base64Data = req.file.buffer.toString("base64");
            const mimeType = req.file.mimetype;
            url = `data:${mimeType};base64,${base64Data}`;
            publicId = `local-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        const media = await Media_1.Media.create({
            url,
            publicId,
            fileName: req.file.originalname,
            sizeBytes,
            format,
        });
        res.status(201).json({ success: true, media });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadMedia = uploadMedia;
const getMedia = async (req, res, next) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const pageSize = Number(limit);
        const pageNum = Number(page);
        const skip = (pageNum - 1) * pageSize;
        const total = await Media_1.Media.countDocuments({});
        const media = await Media_1.Media.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / pageSize),
            media,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMedia = getMedia;
const deleteMedia = async (req, res, next) => {
    try {
        const { id } = req.params; // MongoDB ObjectID or publicId
        let media = await Media_1.Media.findById(id);
        if (!media) {
            media = await Media_1.Media.findOne({ publicId: id });
        }
        if (!media) {
            return res.status(404).json({ success: false, message: "Media resource not found to delete." });
        }
        // Delete asset from Cloudinary if it's not locally stored in DB
        if (!media.publicId.startsWith("local-")) {
            try {
                await (0, cloudinary_1.deleteFromCloudinary)(media.publicId);
            }
            catch (err) {
                console.error("Cloudinary deletion failed, continuing:", err);
            }
        }
        // Delete record from DB
        await Media_1.Media.findByIdAndDelete(media._id);
        res.status(200).json({ success: true, message: "Media deleted successfully from storage." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMedia = deleteMedia;
