import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { AdminUser } from "./models/AdminUser";

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    const count = await AdminUser.countDocuments();
    if (count > 0) {
      console.log("Seeding skipped. Admin users already exist in the database.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("adminpassword123", salt);

    await AdminUser.create({
      name: "Eco Shine Admin",
      email: "admin@ecoshine.com",
      passwordHash,
      role: "super-admin",
    });

    console.log("Default Super Admin account seeded successfully!");
    console.log("Email: admin@ecoshine.com");
    console.log("Password: adminpassword123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
