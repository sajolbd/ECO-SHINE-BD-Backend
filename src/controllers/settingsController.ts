import { Request, Response, NextFunction } from "express";
import { SiteSettings } from "../models/SiteSettings";

// Default settings fallback
const DEFAULT_SETTINGS = {
  websiteName: "Eco Shine Bangladesh",
  phone: "01958-058359",
  email: "bdecoshine@gmail.com",
  whatsapp: "8801958058359",
  currency: "৳",
  deliveryChargeInside: 70,
  deliveryChargeOutside: 130,
  codEnabled: true,
  maintenanceMode: false,
};

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      // Seed default settings dynamically if database is empty
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULT_SETTINGS, ...req.body });
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};
