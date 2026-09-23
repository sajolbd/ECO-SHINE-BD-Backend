import { Schema, model, Document } from "mongoose";

export interface ICustomPixel {
  id: string;
  name: string;
  pixelId: string;
  enabled: boolean;
}

export interface IPixelSettings extends Document {
  pixelId: string;
  enabled: boolean;
  capiAccessToken?: string;
  testEventCode?: string;
  enableCapi: boolean;
  trackPageView: boolean;
  trackViewContent: boolean;
  trackAddToCart: boolean;
  trackInitiateCheckout: boolean;
  trackPurchase: boolean;
  trackContact: boolean;
  customPixels: ICustomPixel[];
  createdAt: Date;
  updatedAt: Date;
}

const PixelSettingsSchema = new Schema<IPixelSettings>(
  {
    pixelId: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    capiAccessToken: { type: String, default: "" },
    testEventCode: { type: String, default: "" },
    enableCapi: { type: Boolean, default: false },
    trackPageView: { type: Boolean, default: true },
    trackViewContent: { type: Boolean, default: true },
    trackAddToCart: { type: Boolean, default: true },
    trackInitiateCheckout: { type: Boolean, default: true },
    trackPurchase: { type: Boolean, default: true },
    trackContact: { type: Boolean, default: true },
    customPixels: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        pixelId: { type: String, required: true },
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export const PixelSettings = model<IPixelSettings>("PixelSettings", PixelSettingsSchema);
