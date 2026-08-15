"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: String, required: true },
    productRef: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
});
const OrderSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
