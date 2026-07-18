"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageContent } from "@/lib/auth/roles";
import { readOptionalFile, saveUploadedImage } from "@/lib/upload";

const designerSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  position: z.string().min(1),
  experience: z.string().min(1),
  specialization: z.string().min(1),
  bio: z.string().min(10),
  languages: z.string().min(1),
  gradient: z.string().min(1),
  icon: z.string().min(1),
  published: z.boolean().default(true),
});

export interface DesignerFormState {
  error?: string;
  success?: boolean;
}

async function requireContentManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageContent(role)) {
    throw new Error("You don't have permission to manage content.");
  }
}

function parseInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    position: formData.get("position"),
    experience: formData.get("experience"),
    specialization: formData.get("specialization"),
    bio: formData.get("bio"),
    languages: formData.get("languages"),
    gradient: formData.get("gradient"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createDesignerAction(_prevState: DesignerFormState, formData: FormData): Promise<DesignerFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = designerSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.designer.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A designer with this slug already exists." };

  let imageUrl: string | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "designers");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  await db.designer.create({ data: { ...parsed.data, imageUrl } });
  revalidatePath("/admin/designers");
  revalidatePath("/designers");
  return { success: true };
}

export async function updateDesignerAction(
  designerId: string,
  _prevState: DesignerFormState,
  formData: FormData
): Promise<DesignerFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = designerSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.designer.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== designerId) return { error: "A designer with this slug already exists." };

  let imageUrl: string | null | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "designers");
    } catch (e) {
      return { error: (e as Error).message };
    }
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  await db.designer.update({
    where: { id: designerId },
    data: { ...parsed.data, ...(imageUrl !== undefined ? { imageUrl } : {}) },
  });
  revalidatePath("/admin/designers");
  revalidatePath("/designers");
  return { success: true };
}

export async function deleteDesignerAction(designerId: string): Promise<{ error?: string }> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.designer.delete({ where: { id: designerId } });
  revalidatePath("/admin/designers");
  revalidatePath("/designers");
  return {};
}
