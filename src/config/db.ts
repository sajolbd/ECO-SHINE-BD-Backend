import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || "mongodb+srv://sajolibn_db_user:82WA5fHDwSEnWgXd@cluster0.vi2cirn.mongodb.net/?appName=Cluster0";

  cachedPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  }).then((m) => {
    console.log(`MongoDB Connected: ${m.connection.host}`);
    return m;
  }).catch((err) => {
    cachedPromise = null;
    console.error(`MongoDB Connection Error: ${err.message}`);
    throw err;
  });

  return cachedPromise;
};
