"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerOrderHistory = exports.getCustomerById = exports.getCustomers = void 0;
const Customer_1 = require("../models/Customer");
const Order_1 = require("../models/Order");
const getCustomers = async (req, res, next) => {
    try {
        const { search, limit = 50, page = 1 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const pageSize = Number(limit);
        const pageNum = Number(page);
        const skip = (pageNum - 1) * pageSize;
        const total = await Customer_1.Customer.countDocuments(query);
        const customers = await Customer_1.Customer.find(query)
            .sort({ totalSpending: -1 })
            .skip(skip)
            .limit(pageSize);
        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / pageSize),
            customers,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await Customer_1.Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }
        res.status(200).json({ success: true, customer });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
const getCustomerOrderHistory = async (req, res, next) => {
    try {
        const { phone } = req.params;
        const orders = await Order_1.Order.find({ phone }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerOrderHistory = getCustomerOrderHistory;
