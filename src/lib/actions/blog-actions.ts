"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageContent } from "@/lib/auth/roles";
import { readOptionalFile, saveUploadedImage } from "@/lib/upload";

const blogSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  excerpt: z.string().min(5),
  body: z.string().min(20),
  category: z.string().min(1),
  author: z.string().min(1),
  readTime: z.string().min(1),
  gradient: z.string().min(1),
  icon: z.string().min(1),
  published: z.boolean().default(true),
});

export interface BlogFormState {
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
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    category: formData.get("category"),
    author: formData.get("author"),
    readTime: formData.get("readTime"),
    gradient: formData.get("gradient"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createBlogPostAction(_prevState: BlogFormState, formData: FormData): Promise<BlogFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = blogSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A post with this slug already exists." };

  let imageUrl: string | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "blog");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  await db.blogPost.create({ data: { ...parsed.data, imageUrl } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPostAction(
  postId: string,
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = blogSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== postId) return { error: "A post with this slug already exists." };

  let imageUrl: string | null | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "blog");
    } catch (e) {
      return { error: (e as Error).message };
    }
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  await db.blogPost.update({
    where: { id: postId },
    data: { ...parsed.data, ...(imageUrl !== undefined ? { imageUrl } : {}) },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPostAction(postId: string): Promise<{ error?: string }> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.blogPost.delete({ where: { id: postId } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}
