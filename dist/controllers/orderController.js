"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallHistory = exports.addCallLog = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const Customer_1 = require("../models/Customer");
const SiteSettings_1 = require("../models/SiteSettings");
// Generate unique Bengali date string
const getBengaliDateString = () => {
    return new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
const createOrder = async (req, res, next) => {
    try {
        const { customerName, phone, email, address, deliveryArea, items, note } = req.body;
        if (!customerName || !phone || !address || !deliveryArea || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Required order details are missing: name, phone, address, deliveryArea, items.",
            });
        }
        // 1. Validate prices and construct items array
        let subtotal = 0;
        const validatedItems = [];
        for (const item of items) {
            const product = await Product_1.Product.findOne({ id: item.productId });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.productId} was not found.`,
                });
            }
            // Decrement stock count
            if (product.stockCount < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product '${product.title}'. Only ${product.stockCount} remaining.`,
                });
            }
            product.stockCount -= item.quantity;
            if (product.stockCount <= 0) {
                product.inStock = false;
            }
            await product.save();
            const itemCost = product.price * item.quantity;
            subtotal += itemCost;
            validatedItems.push({
                productId: product.id,
                productRef: product._id,
                title: product.title,
                price: product.price,
                costPrice: product.costPrice || 0,
                quantity: item.quantity,
                image: product.images[0] || "",
                selectedColor: item.selectedColor || item.color || "",
            });
        }
        // Check if free delivery is applicable (item quantity >= product.freeDeliveryMinQty or default 2)
        let hasFreeDelivery = false;
        for (const item of items) {
            const product = await Product_1.Product.findOne({ id: item.productId });
            const minQty = (product && product.freeDeliveryMinQty !== undefined) ? product.freeDeliveryMinQty : 2;
            if (item.quantity >= minQty) {
                hasFreeDelivery = true;
                break;
            }
        }
        let deliveryFee = 0;
        if (!hasFreeDelivery) {
            let deliveryChargeInside = 70;
            let deliveryChargeOutside = 130;
            try {
                const settings = await SiteSettings_1.SiteSettings.findOne({});
                if (settings) {
                    deliveryChargeInside = settings.deliveryChargeInside ?? 70;
                    deliveryChargeOutside = settings.deliveryChargeOutside ?? 130;
                }
            }
            catch (err) {
                // Fallback to hardcoded defaults
            }
            deliveryFee = deliveryArea === "inside" ? deliveryChargeInside : deliveryChargeOutside;
        }
        const total = subtotal + deliveryFee;
        const orderId = `ESB-${Math.floor(100000 + Math.random() * 900000)}`;
        // 2. Create the Order
        const order = await Order_1.Order.create({
            orderId,
            customerName,
            phone,
            email,
            address,
            deliveryArea,
            deliveryFee,
            items: validatedItems,
            subtotal,
            total,
            note,
            dateString: getBengaliDateString(),
        });
        // 3. Upsert Customer details
        const cleanedPhone = phone.trim();
        let customer = await Customer_1.Customer.findOne({ phone: cleanedPhone });
        if (customer) {
            customer.name = customerName; // sync latest name
            if (email)
                customer.email = email;
            customer.totalOrders += 1;
            customer.totalSpending += total;
            customer.lastOrderDate = new Date();
            await customer.save();
        }
        else {
            await Customer_1.Customer.create({
                name: customerName,
                phone: cleanedPhone,
                email,
                totalOrders: 1,
                totalSpending: total,
                lastOrderDate: new Date(),
            });
        }
        res.status(201).json({ success: true, order });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res, next) => {
    try {
        const { status, callStatus, search, limit = 50, page = 1 } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (callStatus)
            query.lastCallStatus = callStatus;
        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        const pageSize = Number(limit);
        const pageNum = Number(page);
        const skip = (pageNum - 1) * pageSize;
        const total = await Order_1.Order.countDocuments(query);
        const orders = await Order_1.Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / pageSize),
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let order = await Order_1.Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_1.Order.findById(id);
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: "Please provide order status to update." });
        }
        let order = await Order_1.Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_1.Order.findById(id);
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found to update status." });
        }
        const oldStatus = order.status;
        order.status = status;
        await order.save();
        // Revert stock count if order is cancelled
        if (status === "cancelled" && oldStatus !== "cancelled") {
            for (const item of order.items) {
                const product = await Product_1.Product.findById(item.productRef);
                if (product) {
                    product.stockCount += item.quantity;
                    product.inStock = true;
                    await product.save();
                }
            }
            // Revert customer spending stats
            const customer = await Customer_1.Customer.findOne({ phone: order.phone });
            if (customer) {
                customer.totalSpending = Math.max(0, customer.totalSpending - order.total);
                customer.totalOrders = Math.max(0, customer.totalOrders - 1);
                await customer.save();
            }
        }
        // Re-apply spending stats if order is restored from cancelled to something else
        if (oldStatus === "cancelled" && status !== "cancelled") {
            for (const item of order.items) {
                const product = await Product_1.Product.findById(item.productRef);
                if (product) {
                    product.stockCount = Math.max(0, product.stockCount - item.quantity);
                    if (product.stockCount <= 0)
                        product.inStock = false;
                    await product.save();
                }
            }
            const customer = await Customer_1.Customer.findOne({ phone: order.phone });
            if (customer) {
                customer.totalSpending += order.total;
                customer.totalOrders += 1;
                await customer.save();
            }
        }
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const addCallLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { callResult, notes, followUpDate, callerName: customCallerName, syncOrderStatus } = req.body;
        const validResults = [
            "confirmed",
            "cancelled",
            "no_answer",
            "busy",
            "wrong_number",
            "phone_off",
            "callback_requested",
        ];
        if (!callResult || !validResults.includes(callResult)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing callResult. Valid values: " + validResults.join(", "),
            });
        }
        let order = await Order_1.Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_1.Order.findById(id);
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found for call logging." });
        }
        const callerName = customCallerName ||
            req.user?.name ||
            req.user?.email ||
            "Admin Employee";
        const callerEmail = req.user?.email;
        const parsedFollowUpDate = followUpDate ? new Date(followUpDate) : undefined;
        const callTime = new Date();
        const newCallLog = {
            callerName,
            callerEmail,
            callResult,
            callTime,
            notes: notes?.trim() || "",
            followUpDate: parsedFollowUpDate,
            orderStatusAtCall: order.status,
        };
        if (!order.callLogs) {
            order.callLogs = [];
        }
        order.callLogs.push(newCallLog);
        order.lastCallStatus = callResult;
        order.lastCallAt = callTime;
        order.lastCalledBy = callerName;
        order.nextFollowUpAt = parsedFollowUpDate;
        // Synchronize primary order status if requested
        if (syncOrderStatus) {
            let targetStatus = null;
            if (callResult === "confirmed")
                targetStatus = "confirmed";
            if (callResult === "cancelled")
                targetStatus = "cancelled";
            if (targetStatus && targetStatus !== order.status) {
                const oldStatus = order.status;
                order.status = targetStatus;
                if (targetStatus === "cancelled" && oldStatus !== "cancelled") {
                    for (const item of order.items) {
                        const product = await Product_1.Product.findById(item.productRef);
                        if (product) {
                            product.stockCount += item.quantity;
                            product.inStock = true;
                            await product.save();
                        }
                    }
                    const customer = await Customer_1.Customer.findOne({ phone: order.phone });
                    if (customer) {
                        customer.totalSpending = Math.max(0, customer.totalSpending - order.total);
                        customer.totalOrders = Math.max(0, customer.totalOrders - 1);
                        await customer.save();
                    }
                }
                if (oldStatus === "cancelled" && targetStatus !== "cancelled") {
                    for (const item of order.items) {
                        const product = await Product_1.Product.findById(item.productRef);
                        if (product) {
                            product.stockCount = Math.max(0, product.stockCount - item.quantity);
                            if (product.stockCount <= 0)
                                product.inStock = false;
                            await product.save();
                        }
                    }
                    const customer = await Customer_1.Customer.findOne({ phone: order.phone });
                    if (customer) {
                        customer.totalSpending += order.total;
                        customer.totalOrders += 1;
                        await customer.save();
                    }
                }
            }
        }
        await order.save();
        res.status(200).json({
            success: true,
            message: "Call log recorded successfully.",
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addCallLog = addCallLog;
const getCallHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        let order = await Order_1.Order.findOne({ orderId: id });
        if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_1.Order.findById(id);
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.status(200).json({
            success: true,
            callLogs: order.callLogs || [],
            lastCallStatus: order.lastCallStatus || "no_call",
            lastCallAt: order.lastCallAt,
            lastCalledBy: order.lastCalledBy,
            nextFollowUpAt: order.nextFollowUpAt,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCallHistory = getCallHistory;
