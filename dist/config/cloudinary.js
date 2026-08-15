"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (fileBuffer, folder = "ecoshine") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error("Cloudinary upload failed. Result is empty."));
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                sizeBytes: result.bytes,
            });
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
