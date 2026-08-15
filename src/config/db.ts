import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Error: MONGODB_URI environment variable is missing.");
    if (process.env.VERCEL !== "1") {
      process.exit(1);
    }
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.VERCEL !== "1") {
      process.exit(1);
    }
  }
};
