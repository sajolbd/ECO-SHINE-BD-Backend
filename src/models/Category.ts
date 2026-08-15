import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string; // matches categoryId e.g. "autocare"
  description?: string;
  image?: string;
  status: "active" | "inactive";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active", required: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", CategorySchema);
