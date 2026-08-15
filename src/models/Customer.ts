import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  { timestamps: true }
);

export const Customer = model<ICustomer>("Customer", CustomerSchema);
