"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
// Helper to slugify names into text IDs
const generateProductId = (title, categoryId) => {
    const prefix = categoryId === "autocare" ? "auto" : categoryId === "homecare" ? "home" : "prod";
    const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // dedupe hyphens
        .trim();
    return `${prefix}-${slug}-${Math.floor(100 + Math.random() * 900)}`;
};
const getProducts = async (req, res, next) => {
    try {
        const { categoryId, status, search, limit = 50, page = 1, featured, bestSeller } = req.query;
        const query = {};
        if (categoryId)
            query.categoryId = categoryId;
        if (status)
            query.status = status;
        if (featured)
            query.featured = featured === "true";
        if (bestSeller)
            query.bestSeller = bestSeller === "true";
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        const pageSize = Number(limit);
        const pageNum = Number(page);
        const skip = (pageNum - 1) * pageSize;
        const total = await Product_1.Product.countDocuments(query);
        const products = await Product_1.Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / pageSize),
            products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check by unique string ID first, then by MongoDB ObjectID
        let product = await Product_1.Product.findOne({ id });
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product_1.Product.findById(id);
        }
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const { title, category, categoryId, price, originalPrice, rating, reviewsCount, images, phone, whatsapp, unit, badge, description, features, howToUse, specifications, faqs, inStock, stockCount, status, featured, bestSeller, seoTitle, seoDescription, } = req.body;
        if (!title || !category || !categoryId || !price || !images || !unit || !description) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing: title, category, categoryId, price, images, unit, description.",
            });
        }
        const generatedId = generateProductId(title, categoryId);
        const product = await Product_1.Product.create({
            id: generatedId,
            title,
            category,
            categoryId,
            price,
            originalPrice,
            rating,
            reviewsCount,
            images,
            phone,
            whatsapp,
            unit,
            badge,
            description,
            features: features || [],
            howToUse: howToUse || [],
            specifications: specifications || [],
            faqs: faqs || [],
            inStock: inStock !== undefined ? inStock : true,
            stockCount: stockCount !== undefined ? stockCount : 99,
            status: status || "active",
            featured: featured || false,
            bestSeller: bestSeller || false,
            seoTitle,
            seoDescription,
        });
        res.status(201).json({ success: true, product });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        let product = await Product_1.Product.findOne({ id });
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product_1.Product.findById(id);
        }
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found to update." });
        }
        // Keep unique string id unmodified, update the rest
        const updatedProduct = await Product_1.Product.findByIdAndUpdate(product._id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, product: updatedProduct });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        let product = await Product_1.Product.findOne({ id });
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product_1.Product.findById(id);
        }
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found to delete." });
        }
        await Product_1.Product.findByIdAndDelete(product._id);
        res.status(200).json({ success: true, message: "Product deleted successfully." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
