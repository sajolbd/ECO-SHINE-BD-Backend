"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const Category_1 = require("../models/Category");
const getCategories = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status)
            query.status = status;
        const categories = await Category_1.Category.find(query).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, categories });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let category = await Category_1.Category.findOne({ slug: id.toLowerCase() });
        if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category_1.Category.findById(id);
        }
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.status(200).json({ success: true, category });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, status, displayOrder } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ success: false, message: "Please provide both category name and slug." });
        }
        const exists = await Category_1.Category.findOne({ slug: slug.toLowerCase() });
        if (exists) {
            return res.status(400).json({ success: false, message: "A category with this slug already exists." });
        }
        const category = await Category_1.Category.create({
            name,
            slug: slug.toLowerCase(),
            description,
            image,
            status: status || "active",
            displayOrder: displayOrder !== undefined ? displayOrder : 0,
        });
        res.status(201).json({ success: true, category });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        let category = await Category_1.Category.findOne({ slug: id.toLowerCase() });
        if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category_1.Category.findById(id);
        }
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found to update." });
        }
        const updatedCategory = await Category_1.Category.findByIdAndUpdate(category._id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, category: updatedCategory });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        let category = await Category_1.Category.findOne({ slug: id.toLowerCase() });
        if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category_1.Category.findById(id);
        }
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found to delete." });
        }
        await Category_1.Category.findByIdAndDelete(category._id);
        res.status(200).json({ success: true, message: "Category deleted successfully." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
