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
  announcements: [
    "স্বাগতম ইকো সাইন বাংলাদেশে — পরিবেশবান্ধব ক্লিনিং ও কালার গার্ড ফোমিং সলিউশন!",
    "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা!",
    "১০০% অরিজিনাল ও প্রিমিয়াম কোয়ালিটি গ্যারান্টিযুক্ত প্রোডাক্টস!",
    "জরুরি অর্ডারের জন্য কল করুন: 01958-058359 | হোয়াটসঅ্যাপেও মেসেজ দেওয়া যাবে।"
  ],
  featuredProducts: ["auto-1", "auto-2", "auto-3"],
  featuredCategories: ["cleaning-products", "houseware"],
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
    } else if (!homepage.announcements || homepage.announcements.length === 0) {
      homepage.announcements = DEFAULT_HOMEPAGE.announcements;
      await homepage.save();
    }

    res.status(200).json({ success: true, homepage });
  } catch (error) {
    next(error);
  }
};

export const updateHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let homepage = await Homepage.findOne({});

    const updateData = { ...req.body };
    if (!updateData.heroHeading || !updateData.heroHeading.trim()) updateData.heroHeading = DEFAULT_HOMEPAGE.heroHeading;
    if (!updateData.heroDescription || !updateData.heroDescription.trim()) updateData.heroDescription = DEFAULT_HOMEPAGE.heroDescription;
    if (!updateData.heroDesktopImage || !updateData.heroDesktopImage.trim()) updateData.heroDesktopImage = DEFAULT_HOMEPAGE.heroDesktopImage;
    if (!updateData.heroMobileImage || !updateData.heroMobileImage.trim()) updateData.heroMobileImage = DEFAULT_HOMEPAGE.heroMobileImage;
    if (!updateData.announcements || updateData.announcements.length === 0) updateData.announcements = DEFAULT_HOMEPAGE.announcements;

    if (!homepage) {
      homepage = await Homepage.create({ ...DEFAULT_HOMEPAGE, ...updateData });
    } else {
      homepage = await Homepage.findByIdAndUpdate(homepage._id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, homepage });
  } catch (error) {
    next(error);
  }
};
