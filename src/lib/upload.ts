import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * Uploads an admin product/content photo to Cloudinary and returns its
 * secure HTTPS URL for storage on the owning row (Product.images,
 * Category.imageUrl, etc.). Cloudinary is the media host; Postgres only
 * ever stores the URL.
 */
export async function saveUploadedImage(file: File, folder: string): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Image must be JPEG, PNG, WEBP or GIF");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await cloudinary.uploader.upload(`data:${file.type};base64,${bytes.toString("base64")}`, {
    folder: `maxlight/${folder}`,
    resource_type: "image",
  });

  return result.secure_url;
}

/** Reads a File from FormData, returning undefined when no file was chosen. */
export function readOptionalFile(formData: FormData, field: string): File | undefined {
  const value = formData.get(field);
  return value instanceof File && value.size > 0 ? value : undefined;
}

/** Reads every non-empty File under `field` from FormData (for multi-file inputs). */
export function readFiles(formData: FormData, field: string): File[] {
  return formData.getAll(field).filter((v): v is File => v instanceof File && v.size > 0);
}

/** Uploads several files in parallel, returning their secure URLs in the same order. */
export async function saveUploadedImages(files: File[], folder: string): Promise<string[]> {
  return Promise.all(files.map((file) => saveUploadedImage(file, folder)));
}
