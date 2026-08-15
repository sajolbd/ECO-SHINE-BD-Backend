import { Schema, model, Document } from "mongoose";

export interface IAbout extends Document {
  title: string;
  description: string;
  images: string[];
  mission?: string;
  vision?: string;
  highlights: string[];
  ctaText?: string;
  ctaLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    mission: { type: String },
    vision: { type: String },
    highlights: { type: [String], default: [] },
    ctaText: { type: String },
    ctaLink: { type: String },
  },
  { timestamps: true }
);

export const About = model<IAbout>("About", AboutSchema);
