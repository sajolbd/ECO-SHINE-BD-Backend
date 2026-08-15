import { Request, Response, NextFunction } from "express";
import { About } from "../models/About";

const DEFAULT_ABOUT = {
  title: "আমরা ইকো সাইন বাংলাদেশ",
  description: "আমরা বাংলাদেশে প্রথম উন্নত ও সাশ্রয়ী মূল্যে গাড়ির কালার প্রটেক্টিং শ্যাম্পু, ন্যানো কোটিং, গ্রিজ রিমুভার ও টাইলস ক্লিনিং কেমিক্যাল সরবরাহ করছি।",
  images: ["/images/about/about-main.jpg"],
  mission: "পরিবেশবান্ধব ও মানসম্মত ক্লিনিং এবং রক্ষণাবেক্ষণ প্রোডাক্ট সরবরাহের মাধ্যমে মানুষের জীবনযাত্রাকে সহজ ও সুরক্ষিত করা।",
  vision: "বাংলাদেশের এক নম্বর ইকোলজিকাল ওয়াশ এবং ক্লিনিং ব্র্যান্ড হিসেবে পরিচিতি লাভ করা।",
  highlights: [
    "১০০% আসল প্রোডাক্টের গ্যারান্টি",
    "সাশ্রয়ী ও বাজেট বান্ধব মূল্য",
    "চমৎকার ও দক্ষ কাস্টমার সাপোর্ট",
  ],
  ctaText: "আমাদের প্রোডাক্ট দেখুন",
  ctaLink: "#products",
};

export const getAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let about = await About.findOne({});

    if (!about) {
      about = await About.create(DEFAULT_ABOUT);
    }

    res.status(200).json({ success: true, about });
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let about = await About.findOne({});

    if (!about) {
      about = await About.create({ ...DEFAULT_ABOUT, ...req.body });
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, about });
  } catch (error) {
    next(error);
  }
};
