import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";

// Helper to slugify names into text IDs
const generateProductId = (title: string, categoryId: string): string => {
  const prefix = (categoryId === "cleaning-products" || categoryId === "autocare") ? "auto" : (categoryId === "houseware" || categoryId === "homecare") ? "home" : "prod";
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // dedupe hyphens
    .trim();
  return `${prefix}-${slug}-${Math.floor(100 + Math.random() * 900)}`;
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, status, search, limit = 50, page = 1, featured, bestSeller } = req.query;

    const query: any = {};

    if (categoryId) query.categoryId = categoryId;
    if (status) query.status = status;
    if (featured) query.featured = featured === "true";
    if (bestSeller) query.bestSeller = bestSeller === "true";

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

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
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
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check by unique string ID first, then by MongoDB ObjectID
    let product = await Product.findOne({ id });

    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      category,
      categoryId,
      price,
      costPrice,
      originalPrice,
      rating,
      reviewsCount,
      images,
      phone,
      whatsapp,
      unit,
      badge,
      description,
      features,
      howToUse,
      specifications,
      faqs,
      inStock,
      stockCount,
      status,
      featured,
      bestSeller,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !category || !categoryId || !price || !images || !unit || !description) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing: title, category, categoryId, price, images, unit, description.",
      });
    }

    const generatedId = generateProductId(title, categoryId);

    const product = await Product.create({
      id: generatedId,
      title,
      category,
      categoryId,
      price,
      costPrice: costPrice !== undefined ? costPrice : 0,
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
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let product = await Product.findOne({ id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found to update." });
    }

    // Keep unique string id unmodified, update the rest
    const updatedProduct = await Product.findByIdAndUpdate(product._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let product = await Product.findOne({ id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found to delete." });
    }

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};
