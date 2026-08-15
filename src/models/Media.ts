import { Schema, model, Document } from "mongoose";

export interface IMedia extends Document {
  url: string;
  publicId: string;
  fileName: string;
  sizeBytes: number;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    format: { type: String, required: true },
  },
  { timestamps: true }
);

export const Media = model<IMedia>("Media", MediaSchema);
