import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  url?: string;
  imageDesktop: string;
  imageMobile: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String },
    subtitle: { type: String },
    ctaText: { type: String },
    url: { type: String },
    imageDesktop: { type: String, required: true },
    imageMobile: { type: String, required: true },
    isActive: { type: Boolean, default: true, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = model<IBanner>("Banner", BannerSchema);
