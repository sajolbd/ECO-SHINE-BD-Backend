import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  productId: string; // The text ID e.g. "auto-1"
  productRef: Types.ObjectId; // Reference to product doc
  title: string;
  price: number;
  costPrice: number;
  quantity: number;
  image: string;
}

export type CallResult =
  | "confirmed"
  | "cancelled"
  | "no_answer"
  | "busy"
  | "wrong_number"
  | "phone_off"
  | "callback_requested";

export interface ICallLog {
  _id?: Types.ObjectId | string;
  callerName: string;
  callerEmail?: string;
  callResult: CallResult;
  callTime: Date;
  notes?: string;
  followUpDate?: Date;
  orderStatusAtCall?: string;
}

export interface IOrder extends Document {
  orderId: string; // unique order code e.g. "ESB-123456"
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  deliveryArea: "inside" | "outside";
  deliveryFee: number;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  note?: string;
  dateString: string;
  callLogs?: ICallLog[];
  lastCallStatus?: CallResult | "no_call";
  lastCallAt?: Date;
  lastCalledBy?: string;
  nextFollowUpAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productRef: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const CallLogSchema = new Schema<ICallLog>(
  {
    callerName: { type: String, required: true },
    callerEmail: { type: String },
    callResult: {
      type: String,
      enum: [
        "confirmed",
        "cancelled",
        "no_answer",
        "busy",
        "wrong_number",
        "phone_off",
        "callback_requested",
      ],
      required: true,
    },
    callTime: { type: Date, default: Date.now, required: true },
    notes: { type: String },
    followUpDate: { type: Date },
    orderStatusAtCall: { type: String },
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String },
    address: { type: String, required: true },
    deliveryArea: { type: String, enum: ["inside", "outside"], required: true },
    deliveryFee: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "ক্যাশ অন ডেলিভারি (Cash on Delivery)" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
      index: true,
    },
    note: { type: String },
    dateString: { type: String, required: true },
    callLogs: { type: [CallLogSchema], default: [] },
    lastCallStatus: {
      type: String,
      enum: [
        "no_call",
        "confirmed",
        "cancelled",
        "no_answer",
        "busy",
        "wrong_number",
        "phone_off",
        "callback_requested",
      ],
      default: "no_call",
      index: true,
    },
    lastCallAt: { type: Date },
    lastCalledBy: { type: String },
    nextFollowUpAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);
