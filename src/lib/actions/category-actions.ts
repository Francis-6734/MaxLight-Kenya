"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageCatalog } from "@/lib/auth/roles";
import { readOptionalFile, saveUploadedImage } from "@/lib/upload";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().min(5, "Description is too short"),
  gradient: z.string().min(1, "Gradient is required"),
  icon: z.string().min(1, "Icon name is required"),
  published: z.boolean().default(true),
});

export interface CategoryFormState {
  error?: string;
  success?: boolean;
}

async function requireCatalogManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageCatalog(role)) {
    throw new Error("You don't have permission to manage categories.");
  }
}

function parseFormInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    gradient: formData.get("gradient"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createCategoryAction(_prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = categorySchema.safeParse(parseFormInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A category with this slug already exists." };

  let imageUrl: string | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "categories");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  await db.category.create({ data: { ...parsed.data, imageUrl } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = categorySchema.safeParse(parseFormInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== categoryId) {
    return { error: "A category with this slug already exists." };
  }

  let imageUrl: string | null | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "categories");
    } catch (e) {
      return { error: (e as Error).message };
    }
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  await db.category.update({
    where: { id: categoryId },
    data: { ...parsed.data, ...(imageUrl !== undefined ? { imageUrl } : {}) },
  });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string): Promise<{ error?: string }> {
  try {
    await requireCatalogManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const productCount = await db.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return { error: `This category has ${productCount} product(s). Move or delete them first.` };
  }

  await db.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  return {};
}
