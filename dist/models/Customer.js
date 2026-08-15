"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = require("mongoose");
const CustomerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
}, { timestamps: true });
exports.Customer = (0, mongoose_1.model)("Customer", CustomerSchema);
