import { Request, Response, NextFunction } from "express";
import { Banner } from "../models/Banner";

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activeOnly } = req.query;
    const query: any = {};
    if (activeOnly === "true") {
      query.isActive = true;
    }

    const banners = await Banner.find(query).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }

    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }

    res.status(200).json({ success: true, message: "Banner deleted successfully." });
  } catch (error) {
    next(error);
  }
};
