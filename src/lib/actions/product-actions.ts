"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageCatalog } from "@/lib/auth/roles";
import { readFiles, saveUploadedImages } from "@/lib/upload";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().min(10, "Description is too short"),
  categoryId: z.string().min(1, "Choose a category"),
  subcategory: z.string().min(1, "Subcategory is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().int().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().int().positive().optional().or(z.literal("")),
  rating: z.coerce.number().min(0, "Rating can't be negative").max(5, "Rating can't be more than 5"),
  reviewCount: z.coerce.number().int().min(0, "Review count can't be negative"),
  rooms: z.array(z.string()).default([]),
  styles: z.array(z.string()).default([]),
  highlights: z.string().default(""),
  inStock: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  placeholderGrad: z.string().min(1, "Gradient is required"),
  placeholderIcon: z.string().min(1, "Icon name is required"),
});

export interface ProductFormState {
  error?: string;
  success?: boolean;
}

async function requireCatalogManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageCatalog(role)) {
    throw new Error("You don't have permission to manage products.");
  }
}

function parseFormInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    subcategory: formData.get("subcategory"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || "",
    rating: formData.get("rating") || 0,
    reviewCount: formData.get("reviewCount") || 0,
    rooms: formData.getAll("rooms"),
    styles: formData.getAll("styles"),
    highlights: formData.get("highlights") ?? "",
    inStock: formData.get("inStock") === "on",
    isNew: formData.get("isNew") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    placeholderGrad: formData.get("placeholderGrad"),
    placeholderIcon: formData.get("placeholderIcon"),
  };
}

export async function createProductAction(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = productSchema.safeParse(parseFormInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "A product with this slug already exists." };

  let images: string[] = [];
  const imageFiles = readFiles(formData, "images");
  if (imageFiles.length > 0) {
    try {
      images = await saveUploadedImages(imageFiles, "products");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const id = `p-${data.slug}`;
  await db.product.create({
    data: {
      id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      categoryId: data.categoryId,
      subcategory: data.subcategory,
      brand: data.brand,
      price: data.price,
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      rating: data.rating,
      reviewCount: data.reviewCount,
      rooms: data.rooms.join(","),
      styles: data.styles.join(","),
      highlights: data.highlights,
      inStock: data.inStock,
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      placeholderGrad: data.placeholderGrad,
      placeholderIcon: data.placeholderIcon,
      images,
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = productSchema.safeParse(parseFormInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== productId) {
    return { error: "A product with this slug already exists." };
  }

  const keptImages = formData.getAll("keepImages").filter((v): v is string => typeof v === "string");
  let newImages: string[] = [];
  const imageFiles = readFiles(formData, "images");
  if (imageFiles.length > 0) {
    try {
      newImages = await saveUploadedImages(imageFiles, "products");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  await db.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      categoryId: data.categoryId,
      subcategory: data.subcategory,
      brand: data.brand,
      price: data.price,
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      rating: data.rating,
      reviewCount: data.reviewCount,
      rooms: data.rooms.join(","),
      styles: data.styles.join(","),
      highlights: data.highlights,
      inStock: data.inStock,
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      placeholderGrad: data.placeholderGrad,
      placeholderIcon: data.placeholderIcon,
      images: [...keptImages, ...newImages],
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductAction(productId: string): Promise<{ error?: string }> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const orderItemCount = await db.orderItem.count({ where: { productId } });
  if (orderItemCount > 0) {
    return { error: "This product has existing orders and can't be deleted. Mark it out of stock instead." };
  }

  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  return {};
}
