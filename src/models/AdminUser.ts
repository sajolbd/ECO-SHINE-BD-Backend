import { Schema, model, Document } from "mongoose";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "super-admin" | "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "admin", "editor"],
      default: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminUser = model<IAdminUser>("AdminUser", AdminUserSchema);
