import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Product } from "./models/Product";
import { Category } from "./models/Category";

dotenv.config();

const importStaticData = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing in backend .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for static data migration...");

    // 1. Seed Categories
    console.log("Seeding categories...");
    await Category.deleteMany({}); // Reset categories
    const categoriesData = [
      {
        name: "Cleaning products",
        slug: "cleaning-products",
        description: "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ যাবতীয় ক্লিনিং সলিউশন",
        image: "/images/products/product-7.jpeg",
        displayOrder: 1,
      },
      {
        name: "Houseware",
        slug: "houseware",
        description: "বাসাবাড়ির কিচেন গ্রিজ ক্লিনার, গ্লাস ক্লিনার ও ফ্লোর ক্লিনার সহ হাউজওয়্যার প্রোডাক্টস",
        image: "/images/products/product-1.jpeg",
        displayOrder: 2,
      },
    ];
    await Category.insertMany(categoriesData);
    console.log("Categories seeded successfully!");

    // 2. Read exported static JSON
    const jsonPath = path.join(__dirname, "static_data.json");
    if (!fs.existsSync(jsonPath)) {
      console.error(`static_data.json not found at ${jsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const parsed = JSON.parse(rawData);
    const rawProducts = parsed.products || [];

    console.log(`Read ${rawProducts.length} products. Seeding products database...`);
    await Product.deleteMany({}); // Reset products

    // Helper functions for default values
    const defaultAutoFeatures = [
      "গাড়ির ও বাইকের অরজিনাল পেইন্ট ও কোটিং সুরক্ষিত রাখে (pH Neutral Formula)।",
      "রোদের অতিবেগুনি রশ্মi (UV rays) ও পরিবেশের দূষণ থেকে রং ফ্যাকাশে হতে দেয় না।",
      "হাইড্রোফোবিক ইফেক্ট প্রদান করে, যার ফলে পানি ও ধূলিকণা সহজে জমা হয় না।",
      "দ্রুত ও সহজে ফোমিং বা পলিশ করা যায়, সময় ও পানি সাশ্রয় করে।",
      "মেটাল, প্লাস্টিক ও গ্লাস সারফেসে কোনো প্রকার ক্ষতিকর প্রভাব ফেলে না।",
    ];

    const defaultHomeFeatures = [
      "জেদি তেলের দাগ, চর্বি ও কালো ময়লা পলকের মধ্যে দূর করতে অত্যন্ত কার্যকরী।",
      "৯৯.৯% জীবাণু ও ব্যাকটেরিয়া ধ্বংস করে পারিবারিক হাইজিন ও সুস্থতা নিশ্চিত করে।",
      "মার্বেল, টাইলস, স্টেইনলেস স্টিল ও অ্যালুমিনিয়াম ফিনিশে স্ক্র্যাচ মুক্ত ক্লিনিং।",
      "পরিবেশবান্ধব ও অ-বিষাক্ত ফর্মুলা, যা সরাসরি ব্যবহারের জন্য সম্পূর্ণ নিরাপদ।",
      "দুর্গন্ধ দূর করে মনোরম সতেজ সুবাস দীর্ঘক্ষণ ধরে রাখে।",
    ];

    const defaultAutoHowToUse = [
      { step: 1, title: "সারফেস ভিজিয়ে নিন", desc: "প্রথমেই পরিষ্কার নরম পানি দিয়ে গাড়ি বা বাইক ভালো করে ভিজিয়ে বাইরের ধূলিকণা ধুয়ে ফেলুন।" },
      { step: 2, title: "ফোমিং সলিউশন প্রয়োগ করুন", desc: "প্যাকেজের মাত্রা অনুযায়ী পানির সাথে মিশিয়ে নরম স্পঞ্জ বা ফোমিং গান দিয়ে সারফেসে প্রলেপ দিন।" },
      { step: 3, title: "নরমভাবে ম্যাসাজ বা ওয়াইপ করুন", desc: "মাইক্রোফাইবার টাওয়েল দিয়ে আলতো হাতে পুরো বডি ঘষে ময়লা আলগা করুন।" },
      { step: 4, title: "পানি দিয়ে ধুয়ে শুকিয়ে নিন", desc: "পরিষ্কার পানি দিয়ে ফোম ধুয়ে শুকনা শুকনো মাইক্রোফাইবার দিয়ে মুছে নিলেই পাবেন নতুন গাড়ির গ্লস।" }
    ];

    const defaultHomeHowToUse = [
      { step: 1, title: "দাগের ওপর স্প্রে করুন", desc: "যেখানে জেদি তেলের দাগ বা ময়লা জমা হয়েছে সেখানে সরাসরি স্প্রে বা প্রলেপ দিন।" },
      { step: 2, title: "১-২ মিনিট অপেক্ষা করুন", desc: "একটি কার্যকর ফিনিশের জন্য সলিউশনটিকে ময়লা গলানোর জন্য ১ থেকে ২ মিনিট সময় দিন।" },
      { step: 3, title: "স্ক্রাবার বা স্পঞ্জ দিয়ে ওয়াইপ করুন", desc: "সাথে থাকা ফ্রি স্ক্রাবার বা নরম স্পঞ্জ দিয়ে ময়লার জায়গাটি আলতোভাবে মুছে নিন।" },
      { step: 4, title: "মুছে শুকিয়ে নিন", desc: "ভেজা তোয়ালে বা নরম কাপড় দিয়ে মুছে নিলেই পেয়ে যাবেন আয়নার মতো চকচকে পরিচ্ছন্নতা।" }
    ];

    const defaultFaqs = [
      { question: "আমি কি প্রোডাক্টটি ডেলিভারি পাওয়ার পর চেক করে পেমেন্ট করতে পারব?", answer: "হ্যাঁ! আমাদের প্রোডাক্ট ক্যাশ অন ডেলিভারিতে পাওয়া যায়। আপনি ডেলিভারিম্যান সামনে রেখে পার্সেল চেক করে টাকা দেবেন।" },
      { question: "ডেলিভারি করতে কত সময় লাগবে এবং ডেলিভারি চার্জ কত?", answer: "ঢাকার ভেতরে ১-২ কর্মদিবসের মধ্যে (চার্জ ৭০৳) এবং ঢাকার বাইরে ২-৩ কর্মদিবসের মধ্যে (চার্জ ১৩০৳) ডেলিভারি পাবেন।" },
      { question: "প্রোডাক্টটির কি কোনো অফার বা ফ্রি আইটেম আছে?", answer: "আমাদের বিভিন্ন অফার প্যাকেজের সাথে প্রিমিয়াম মাইক্রোফাইবার টাওয়েল বা কিচেন স্ক্রাবার ফ্রী দেওয়া হয় (প্রোডাক্ট টাইটেল অনুযায়ী)।" },
      { question: "প্রোডাক্টের গুণগত মান পছন্দ না হলে রিটার্ন করা যাবে?", answer: "জি, কোনো ম্যানুফ্যাকচারিং ত্রুটি বা ক্ষতিগ্রস্ত পণ্য পেলে ৭ দিনের রিটার্ন ও ইনস্ট্যান্ট রিপ্লেসমেন্ট সুবিধা রয়েছে।" }
    ];

    const seededProducts = [];

    for (const raw of rawProducts) {
      const isAuto = raw.categoryId === "cleaning-products" || raw.categoryId === "autocare";

      const features = raw.features || (isAuto ? defaultAutoFeatures : defaultHomeFeatures);
      const howToUse = raw.howToUse || (isAuto ? defaultAutoHowToUse : defaultHomeHowToUse);
      const faqs = raw.faqs || defaultFaqs;
      
      const specifications = raw.specifications || [
        { key: "ব্র্যান্ড (Brand)", value: "ইকো সাইন বাংলাদেশ (Eco Shine BD)" },
        { key: "ক্যাটাগরি (Category)", value: raw.category },
        { key: "নেট পরিমাণ (Net Unit)", value: raw.unit || "N/A" },
        { key: "ফর্মুলা টেকনোলজি", value: "জাপানি ইকো-কোটিং & সেফটি অ্যাক্টিভস" },
        { key: "অরিজিন (Origin)", value: "১০০% অরিজিনাল ম্যানুফ্যাকচার্ড ইন বাংলাদেশ" },
        { key: "সেলফ লাইফ (Shelf Life)", value: "উৎপাদনের তারিখ থেকে ২৪ মাস (২ বছর)" },
        { key: "নিরাপত্তা লেভেল", value: "১০০% নন-টক্সিক ও স্ক্র্যাচ-ফ্রি সারফেস সেফ" }
      ];

      const productPayload = {
        id: raw.id,
        title: raw.title,
        category: raw.category,
        categoryId: raw.categoryId,
        price: raw.price,
        originalPrice: raw.originalPrice || raw.price + 100,
        rating: raw.rating || 4.9,
        reviewsCount: raw.reviewsCount || Math.floor(Math.random() * 200) + 150,
        images: raw.images && raw.images.length > 0 ? raw.images : ["/images/products/product-1.jpeg"],
        phone: raw.phone || "01958-058359",
        whatsapp: raw.whatsapp || "8801958058359",
        unit: raw.unit || "১ পিস",
        badge: raw.badge || "",
        description: raw.description,
        features,
        howToUse,
        specifications,
        faqs,
        inStock: raw.inStock ?? true,
        stockCount: raw.stockCount ?? Math.floor(Math.random() * 20) + 25,
      };

      seededProducts.push(productPayload);
    }

    await Product.insertMany(seededProducts);
    console.log(`Successfully seeded ${seededProducts.length} products to MongoDB database!`);
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

importStaticData();
