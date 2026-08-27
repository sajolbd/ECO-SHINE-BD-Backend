import mongoose from "mongoose";
import dns from "dns";

// Configure fallback DNS resolvers (Google & Cloudflare) to prevent SRV lookup timeouts on restricted local networks
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignored if dns.setServers is restricted in certain serverless environments
}

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://sajolibn_db_user:82WA5fHDwSEnWgXd@cluster0.vi2cirn.mongodb.net/?appName=Cluster0";

  cachedPromise = mongoose
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
