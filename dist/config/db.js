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
    const uri = process.env.MONGODB_URI || "mongodb+srv://sajolibn_db_user:82WA5fHDwSEnWgXd@cluster0.vi2cirn.mongodb.net/?appName=Cluster0";
    try {
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 4000,
            bufferCommands: false,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};
exports.connectDB = connectDB;
