import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRoutes from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";

// Load Environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
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

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith("ecoshinebd.com")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access from origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Payload parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Custom lightweight Cookie Parser Middleware
app.use((req: any, res: Response, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie: string) => {
      const parts = cookie.split("=");
      const key = parts[0].trim();
      const val = decodeURIComponent(parts[1]?.trim() || "");
      req.cookies[key] = val;
    });
  }
  next();
});

// Health check / API Welcome
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Eco Shine Bangladesh API Service.",
    status: "Healthy",
    timestamp: new Date(),
  });
});

// Register API Routes
app.use("/api", apiRoutes);

// Register Global Error Handler
app.use(errorHandler);

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

export default app;
