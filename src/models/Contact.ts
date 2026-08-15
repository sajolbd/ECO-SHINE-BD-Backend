import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  otherSocialLinks: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    businessHours: { type: String, required: true },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    otherSocialLinks: { type: Map, of: String, default: new Map() },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", ContactSchema);
