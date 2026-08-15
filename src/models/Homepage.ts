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
    heroHeading: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroBadge: { type: String },
    heroButtonText: { type: String },
    heroButtonUrl: { type: String },
    heroDesktopImage: { type: String, required: true },
    heroMobileImage: { type: String, required: true },
    heroEnabled: { type: Boolean, default: true },
    featuredProducts: { type: [String], default: [] },
    featuredCategories: { type: [String], default: [] },
    whyChooseUs: { type: [WhyChooseUsSchema], default: [] },
    promotionalSections: { type: [PromotionalSectionSchema], default: [] },
  },
  { timestamps: true }
);

export const Homepage = model<IHomepage>("Homepage", HomepageSchema);
