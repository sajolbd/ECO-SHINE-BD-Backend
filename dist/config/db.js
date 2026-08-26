"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    // If already connected (readyState 1) or connecting (readyState 2), return
    if (mongoose_1.default.connection.readyState >= 1) {
        return;
    }
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("Error: MONGODB_URI environment variable is missing.");
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            bufferCommands: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};
exports.connectDB = connectDB;
