import { Request, Response, NextFunction } from "express";
import { Homepage } from "../models/Homepage";

const DEFAULT_HOMEPAGE = {
  heroHeading: "Shine Your World With Eco Shine",
  heroDescription: "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।",
  heroBadge: "Bangladesh's #1 Eco-Shine & Renovation Hub",
  heroButtonText: "প্রোডাক্ট দেখুন",
  heroButtonUrl: "#products",
  heroDesktopImage: "/images/home/hero/hero-bg.png",
  heroMobileImage: "/images/home/hero/hero-bg-mobile.png",
  heroEnabled: true,
  featuredProducts: ["auto-1", "auto-2", "auto-3"],
  featuredCategories: ["autocare", "homecare"],
  whyChooseUs: [
    { icon: "Award", title: "১০০% প্রিমিয়াম কোয়ালিটি", description: "আমাদের সব প্রোডাক্ট সর্বোচ্চ মান নিয়ন্ত্রণ করে তৈরি হয়।", displayOrder: 1, status: "active" },
    { icon: "Truck", title: "দ্রুত ডেলিভারি", description: "সারা বাংলাদেশে ৭২ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারি সম্পন্ন করি।", displayOrder: 2, status: "active" },
    { icon: "ShieldCheck", title: "নিরাপদ লেনদেন", description: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করার পূর্ণ সুবিধা।", displayOrder: 3, status: "active" },
  ],
  promotionalSections: [],
};

export const getHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let homepage = await Homepage.findOne({});

    if (!homepage) {
      homepage = await Homepage.create(DEFAULT_HOMEPAGE);
    }

    res.status(200).json({ success: true, homepage });
  } catch (error) {
    next(error);
  }
};

export const updateHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let homepage = await Homepage.findOne({});

    if (!homepage) {
      homepage = await Homepage.create({ ...DEFAULT_HOMEPAGE, ...req.body });
    } else {
      homepage = await Homepage.findByIdAndUpdate(homepage._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, homepage });
  } catch (error) {
    next(error);
  }
};
