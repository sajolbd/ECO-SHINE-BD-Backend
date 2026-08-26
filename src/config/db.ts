import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  // If already connected (readyState 1) or connecting (readyState 2), return
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || "mongodb+srv://sajolibn_db_user:82WA5fHDwSEnWgXd@cluster0.vi2cirn.mongodb.net/?appName=Cluster0";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      bufferCommands: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};
