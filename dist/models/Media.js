"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = require("mongoose");
const MediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    format: { type: String, required: true },
}, { timestamps: true });
exports.Media = (0, mongoose_1.model)("Media", MediaSchema);
