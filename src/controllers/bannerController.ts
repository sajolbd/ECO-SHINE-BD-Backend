import { Request, Response, NextFunction } from "express";
import { Banner } from "../models/Banner";

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activeOnly } = req.query;
    const query: any = {};
    if (activeOnly === "true") {
      query.isActive = true;
    }

    // Check if default banners exist, if not seed them
    const defaultCheck = await Banner.findOne({ title: "Tank Guard Cleaning Solution" });
    if (!defaultCheck) {
      const defaultBanners = [
        {
          title: "Tank Guard Cleaning Solution",
          subtitle: "Water Tank Care",
          ctaText: "Best Seller",
          url: "/#products",
          imageDesktop: "/images/products/product-1.jpeg",
          imageMobile: "/images/products/product-1.jpeg",
          isActive: true,
          displayOrder: 1,
        },
        {
          title: "Kitchen & Tiles Cleaner",
          subtitle: "Grease & Tile Care",
          ctaText: "Top Rated",
          url: "/#products",
          imageDesktop: "/images/products/product-2.jpeg",
          imageMobile: "/images/products/product-2.jpeg",
          isActive: true,
          displayOrder: 2,
        },
        {
          title: "Bubble Boss Foaming Gel",
          subtitle: "Auto Detailing & Wash",
          ctaText: "Popular",
          url: "/#products",
          imageDesktop: "/images/products/product-3.jpeg",
          imageMobile: "/images/products/product-3.jpeg",
          isActive: true,
          displayOrder: 3,
        },
        {
          title: "Bubble Boss Colour Guard",
          subtitle: "Car & Bike Care",
          ctaText: "Featured",
          url: "/#products",
          imageDesktop: "/images/products/product-4.jpeg",
          imageMobile: "/images/products/product-4.jpeg",
          isActive: true,
          displayOrder: 4,
        },
        {
          title: "Bubble Boss Foaming Gel (550ml)",
          subtitle: "Colour Guard Wash",
          ctaText: "Hot Deal",
          url: "/#products",
          imageDesktop: "/images/products/product-5.jpeg",
          imageMobile: "/images/products/product-5.jpeg",
          isActive: true,
          displayOrder: 5,
        },
        {
          title: "Premium Car & Bike Wax",
          subtitle: "Shine & Paint Protection",
          ctaText: "Eco Choice",
          url: "/#products",
          imageDesktop: "/images/products/product-6.jpeg",
          imageMobile: "/images/products/product-6.jpeg",
          isActive: true,
          displayOrder: 6,
        },
        {
          title: "Bubble Boss Foaming Gel Combo",
          subtitle: "Foam Wash Special",
          ctaText: "Combo wash",
          url: "/#products",
          imageDesktop: "/images/products/product-7.jpeg",
          imageMobile: "/images/products/product-7.jpeg",
          isActive: true,
          displayOrder: 7,
        },
        {
          title: "Bubble Boss Foaming Gel (250ml)",
          subtitle: "Auto Care Essentials",
          ctaText: "Best wash",
          url: "/#products",
          imageDesktop: "/images/products/product-8.jpeg",
          imageMobile: "/images/products/product-8.jpeg",
          isActive: true,
          displayOrder: 8,
        }
      ];
      await Banner.insertMany(defaultBanners);
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
