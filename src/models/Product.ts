import { Schema, model, Document } from "mongoose";

export interface IProductFeatureStep {
  step: number;
  title: string;
  desc: string;
}

export interface IProductSpecItem {
  key: string;
  value: string;
}

export interface IProductFaqItem {
  question: string;
  answer: string;
}

export interface IProduct extends Document {
  id: string; // Unique URL identifier e.g. "auto-1"
  title: string;
  category: string;
  categoryId: string;
  price: number;
  costPrice: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  phone: string;
  whatsapp: string;
  unit: string;
  badge?: string;
  description: string;
  features: string[];
  howToUse: IProductFeatureStep[];
  specifications: IProductSpecItem[];
  faqs: IProductFaqItem[];
  inStock: boolean;
  stockCount: number;
  status: "active" | "inactive";
  featured: boolean;
  bestSeller: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, default: 0, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 100 },
    images: { type: [String], required: true, default: [] },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    unit: { type: String, required: true },
    badge: { type: String },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    howToUse: [
      {
        step: { type: Number },
        title: { type: String },
        desc: { type: String },
      },
    ],
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 99 },
    status: { type: String, enum: ["active", "inactive"], default: "active", required: true, index: true },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);
