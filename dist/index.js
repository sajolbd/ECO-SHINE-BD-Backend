"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const api_1 = __importDefault(require("./routes/api"));
const errorHandler_1 = require("./middleware/errorHandler");
// Load Environment variables
dotenv_1.default.config();
// Connect to Database
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://ecoshinebd.com",
    "https://www.ecoshinebd.com",
    "https://dashboard.ecoshinebd.com",
    "https://www.dashboard.ecoshinebd.com",
    "https://eco-shine-bd.vercel.app",
    "https://dashboard-eco-shine-bd.vercel.app",
];
const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.indexOf(origin) !== -1 ||
            origin.endsWith("ecoshinebd.com")) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS policy blocked access from origin: ${origin}`));
        }
    },
    credentials: true,
}));
// Payload parsers
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Custom lightweight Cookie Parser Middleware
app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
        cookieHeader.split(";").forEach((cookie) => {
            const parts = cookie.split("=");
            const key = parts[0].trim();
            const val = decodeURIComponent(parts[1]?.trim() || "");
            req.cookies[key] = val;
        });
    }
    next();
});
// Health check / API Welcome
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Eco Shine Bangladesh API Service.",
        status: "Healthy",
        timestamp: new Date(),
    });
});
// Middleware to ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
    try {
        await (0, db_1.connectDB)();
        next();
    }
    catch (err) {
        next(err);
    }
});
// Register API Routes
app.use("/api", api_1.default);
// Register Global Error Handler
app.use(errorHandler_1.errorHandler);
// Listen on server
if (process.env.VERCEL !== "1") {
    app.use((req, res, next) => {
        // local logger helper
        next();
    });
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
}
exports.default = app;
