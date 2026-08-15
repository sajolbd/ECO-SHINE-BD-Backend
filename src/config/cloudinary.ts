import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder = "ecoshine"
): Promise<{ url: string; publicId: string; format: string; sizeBytes: number }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed. Result is empty."));

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          sizeBytes: result.bytes,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export { cloudinary };
