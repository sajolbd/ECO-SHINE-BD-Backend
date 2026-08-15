import { Request, Response, NextFunction } from "express";
import { SEO } from "../models/SEO";

const DEFAULT_SEO_METADATA: any = {
  home: {
    pageName: "home",
    title: "Eco Shine Bangladesh | Environment, Safety & Health Solutions",
    description: "Eco Shine Bangladesh provides premium eco-friendly cleaning, surface protection, car wash foaming gel, waterproofing, and polishing solutions across Bangladesh.",
    keywords: ["Eco Shine Bangladesh", "Bubble Boss Foaming Gel", "Car & Bike Wax Bangladesh", "Tank Guard Cleaning"],
  },
  products: {
    pageName: "products",
    title: "সকল প্রোডাক্টস | Eco Shine Bangladesh",
    description: "আমাদের জনপ্রিয় প্রিমিয়াম কার কেয়ার এবং হোম কেয়ার ক্লিনিং প্রোডাক্টসমূহ অর্ডার করুন।",
    keywords: ["প্রোডাক্টস", "কার কেয়ার শ্যাম্পু", "গ্রিজ রিমুভার", "Eco Shine Bangladesh"],
  },
  categories: {
    pageName: "categories",
    title: "ক্যাটাগরি সমূহ | Eco Shine Bangladesh",
    description: "অটো কেয়ার এবং হোম কিচেন কেয়ার ক্যাটাগরির প্রোডাক্টসমূহ দেখুন।",
    keywords: ["ক্যাটাগরি", "অটো কেয়ার", "হোম কেয়ার"],
  },
  about: {
    pageName: "about",
    title: "আমাদের সম্পর্কে | Eco Shine Bangladesh",
    description: "ইকো সাইন বাংলাদেশ সম্পর্কে বিস্তারিত জানুন। আমাদের মিশন, ভিশন ও বিশেষত্বসমূহ।",
    keywords: ["আমাদের সম্পর্কে", "মিশন", "ভিশন", "ইকো সাইন"],
  },
  contact: {
    pageName: "contact",
    title: "যোগাযোগ করুন | Eco Shine Bangladesh",
    description: "আমাদের কাস্টমার হটলাইন ও ইমেইলের মাধ্যমে যোগাযোগ করুন। মিরপুর অফিস লোকেশন।",
    keywords: ["যোগাযোগ", "ফোন নম্বর", "অফিস লোকেশন", "ঢাকা"],
  },
};

export const getSEO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageName } = req.params;
    let seo = await SEO.findOne({ pageName: pageName.toLowerCase() });

    if (!seo) {
      const defaultPageData = DEFAULT_SEO_METADATA[pageName.toLowerCase()];
      if (defaultPageData) {
        seo = await SEO.create(defaultPageData);
      } else {
        seo = await SEO.create({
          pageName: pageName.toLowerCase(),
          title: `${pageName} | Eco Shine Bangladesh`,
          description: `Eco Shine Bangladesh dynamic page for ${pageName}.`,
          keywords: ["Eco Shine Bangladesh", pageName],
        });
      }
    }

    res.status(200).json({ success: true, seo });
  } catch (error) {
    next(error);
  }
};

export const updateSEO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageName } = req.params;
    let seo = await SEO.findOne({ pageName: pageName.toLowerCase() });

    const defaultPageData = DEFAULT_SEO_METADATA[pageName.toLowerCase()] || {
      pageName: pageName.toLowerCase(),
      title: `${pageName} | Eco Shine Bangladesh`,
      description: `Eco Shine Bangladesh dynamic page for ${pageName}.`,
      keywords: ["Eco Shine Bangladesh", pageName],
    };

    if (!seo) {
      seo = await SEO.create({ ...defaultPageData, ...req.body });
    } else {
      seo = await SEO.findOneAndUpdate({ pageName: pageName.toLowerCase() }, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, seo });
  } catch (error) {
    next(error);
  }
};
