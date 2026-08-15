import { Request, Response, NextFunction } from "express";
import { Media } from "../models/Media";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary";

export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select an image file to upload." });
    }

    const { url, publicId, format, sizeBytes } = await uploadToCloudinary(
      req.file.buffer,
      "ecoshine"
    );

    const media = await Media.create({
      url,
      publicId,
      fileName: req.file.originalname,
      sizeBytes,
      format,
    });

    res.status(201).json({ success: true, media });
  } catch (error) {
    next(error);
  }
};

export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const pageSize = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * pageSize;

    const total = await Media.countDocuments({});
    const media = await Media.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
      media,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // MongoDB ObjectID or publicId

    let media = await Media.findById(id);
    if (!media) {
      media = await Media.findOne({ publicId: id });
    }

    if (!media) {
      return res.status(404).json({ success: false, message: "Media resource not found to delete." });
    }

    // Delete asset from Cloudinary
    await deleteFromCloudinary(media.publicId);

    // Delete record from DB
    await Media.findByIdAndDelete(media._id);

    res.status(200).json({ success: true, message: "Media deleted successfully from storage." });
  } catch (error) {
    next(error);
  }
};
