import { Schema, model, Document } from "mongoose";

export interface ISEO extends Document {
  pageName: string; // e.g. "home", "products", "categories", "about", "contact"
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SEOSchema = new Schema<ISEO>(
  {
    pageName: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    robots: { type: String, default: "index, follow" },
  },
  { timestamps: true }
);

export const SEO = model<ISEO>("SEO", SEOSchema);
