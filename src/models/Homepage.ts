import { Schema, model, Document } from "mongoose";

export interface IWhyChooseUsItem {
  icon: string; // e.g. "ShieldCheck", "Truck", "Award"
  title: string;
  description: string;
  displayOrder: number;
  status: "active" | "inactive";
}

export interface IPromotionalSection {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  status: "active" | "inactive";
}

export interface IHomepage extends Document {
  heroHeading: string;
  heroDescription: string;
  heroBadge?: string;
  heroButtonText?: string;
  heroButtonUrl?: string;
  heroDesktopImage: string;
  heroMobileImage: string;
  heroEnabled: boolean;
  announcements?: string[];
  featuredProducts: string[]; // references Product.id values e.g. ["auto-1", "home-2"]
  featuredCategories: string[]; // references Category.slug values e.g. ["autocare", "homecare"]
  whyChooseUs: IWhyChooseUsItem[];
  promotionalSections: IPromotionalSection[];
  createdAt: Date;
  updatedAt: Date;
}

const WhyChooseUsSchema = new Schema<IWhyChooseUsItem>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const PromotionalSectionSchema = new Schema<IPromotionalSection>({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const HomepageSchema = new Schema<IHomepage>(
  {
    heroHeading: { type: String, default: "Shine Your World With Eco Shine" },
    heroDescription: { type: String, default: "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।" },
    heroBadge: { type: String, default: "Bangladesh's #1 Eco-Shine & Renovation Hub" },
    heroButtonText: { type: String, default: "প্রোডাক্ট দেখুন" },
    heroButtonUrl: { type: String, default: "#products" },
    heroDesktopImage: { type: String, default: "/images/home/hero/hero-bg.png" },
    heroMobileImage: { type: String, default: "/images/home/hero/hero-bg-mobile.png" },
    heroEnabled: { type: Boolean, default: true },
    announcements: { type: [String], default: [] },
    featuredProducts: { type: [String], default: [] },
    featuredCategories: { type: [String], default: [] },
    whyChooseUs: { type: [WhyChooseUsSchema], default: [] },
    promotionalSections: { type: [PromotionalSectionSchema], default: [] },
  },
  { timestamps: true }
);

export const Homepage = model<IHomepage>("Homepage", HomepageSchema);
