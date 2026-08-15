import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    const categories = await Category.find(query).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let category = await Category.findOne({ slug: id.toLowerCase() });
    if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, image, status, displayOrder } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Please provide both category name and slug." });
    }

    const exists = await Category.findOne({ slug: slug.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "A category with this slug already exists." });
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description,
      image,
      status: status || "active",
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let category = await Category.findOne({ slug: id.toLowerCase() });
    if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found to update." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(category._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let category = await Category.findOne({ slug: id.toLowerCase() });
    if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found to delete." });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};
