import { Schema, model, Document } from "mongoose";

export interface ISiteSettings extends Document {
  websiteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone: string;
  email: string;
  whatsapp: string;
  currency: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
  codEnabled: boolean;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    websiteName: { type: String, default: "Eco Shine Bangladesh", required: true },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    primaryColor: { type: String, default: "#3AA833" },
    secondaryColor: { type: String, default: "#000000" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    currency: { type: String, default: "৳", required: true },
    deliveryChargeInside: { type: Number, default: 70, required: true },
    deliveryChargeOutside: { type: Number, default: 130, required: true },
    codEnabled: { type: Boolean, default: true, required: true },
    maintenanceMode: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export const SiteSettings = model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
