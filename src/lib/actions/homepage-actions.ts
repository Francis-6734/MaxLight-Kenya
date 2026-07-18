"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageContent } from "@/lib/auth/roles";
import { readOptionalFile, saveUploadedImage } from "@/lib/upload";

async function requireContentManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageContent(role)) {
    throw new Error("You don't have permission to manage content.");
  }
}

// ---------- Hero Slides ----------

const heroSlideSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  gradient: z.string().min(1),
  icon: z.string().min(1),
  published: z.boolean().default(true),
});

export interface HeroSlideFormState {
  error?: string;
  success?: boolean;
}

function parseHeroInput(formData: FormData) {
  return {
    eyebrow: formData.get("eyebrow"),
    headline: formData.get("headline"),
    subtitle: formData.get("subtitle"),
    primaryCtaLabel: formData.get("primaryCtaLabel"),
    primaryCtaHref: formData.get("primaryCtaHref"),
    secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    secondaryCtaHref: formData.get("secondaryCtaHref"),
    gradient: formData.get("gradient"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createHeroSlideAction(_prevState: HeroSlideFormState, formData: FormData): Promise<HeroSlideFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const parsed = heroSlideSchema.safeParse(parseHeroInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  let imageUrl: string | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "hero");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const count = await db.heroSlide.count();
  await db.heroSlide.create({ data: { ...parsed.data, imageUrl, sortOrder: count } });
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}

export async function updateHeroSlideAction(
  slideId: string,
  _prevState: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const parsed = heroSlideSchema.safeParse(parseHeroInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  let imageUrl: string | null | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "hero");
    } catch (e) {
      return { error: (e as Error).message };
    }
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  await db.heroSlide.update({
    where: { id: slideId },
    data: { ...parsed.data, ...(imageUrl !== undefined ? { imageUrl } : {}) },
  });
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHeroSlideAction(slideId: string): Promise<{ error?: string }> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }
  await db.heroSlide.delete({ where: { id: slideId } });
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return {};
}

// ---------- Home Sections ----------

const homeSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export interface HomeSectionFormState {
  error?: string;
  success?: boolean;
}

export async function updateHomeSectionAction(
  sectionId: string,
  _prevState: HomeSectionFormState,
  formData: FormData
): Promise<HomeSectionFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = homeSectionSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await db.homeSection.update({ where: { id: sectionId }, data: parsed.data });
  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
