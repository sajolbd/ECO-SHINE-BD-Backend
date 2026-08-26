import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  // If already connected (readyState 1) or connecting (readyState 2), return
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Error: MONGODB_URI environment variable is missing.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};
