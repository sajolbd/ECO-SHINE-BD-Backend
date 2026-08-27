"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
// Configure fallback DNS resolvers (Google & Cloudflare) to prevent SRV lookup timeouts on restricted local networks
try {
    dns_1.default.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
    if (dns_1.default.setDefaultResultOrder) {
        dns_1.default.setDefaultResultOrder("ipv4first");
    }
}
catch (e) {
    // Ignored if dns.setServers is restricted in certain serverless environments
}
let cachedPromise = null;
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default;
    }
    if (cachedPromise) {
        return cachedPromise;
    }
    const uri = process.env.MONGODB_URI ||
        "mongodb+srv://sajolibn_db_user:82WA5fHDwSEnWgXd@cluster0.vi2cirn.mongodb.net/?appName=Cluster0";
    cachedPromise = mongoose_1.default
        .connect(uri, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
    })
        .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
    })
        .catch((err) => {
        cachedPromise = null;
        console.error(`MongoDB Connection Error: ${err.message}`);
        throw err;
    });
    return cachedPromise;
};
exports.connectDB = connectDB;
