"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageSettings } from "@/lib/auth/roles";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  announcementText: z.string().min(1),
  announcementLinkLabel: z.string().default(""),
  announcementLinkHref: z.string().default(""),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  footerDescription: z.string().min(1),
  facebookUrl: z.string().default(""),
  instagramUrl: z.string().default(""),
  tiktokUrl: z.string().default(""),
  pinterestUrl: z.string().default(""),
  youtubeUrl: z.string().default(""),
  linkedinUrl: z.string().default(""),
  xUrl: z.string().default(""),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().default(""),
});

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

async function requireSettingsManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageSettings(role)) {
    throw new Error("You don't have permission to manage site settings.");
  }
}

export async function updateSiteSettingsAction(_prevState: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  try {
    await requireSettingsManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}

const footerLinkSchema = z.object({
  column: z.enum(["shop", "company", "customer-care", "legal"]),
  label: z.string().min(1),
  href: z.string().min(1),
});

export interface FooterLinkFormState {
  error?: string;
  success?: boolean;
}

export async function createFooterLinkAction(_prevState: FooterLinkFormState, formData: FormData): Promise<FooterLinkFormState> {
  try {
    await requireSettingsManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = footerLinkSchema.safeParse({
    column: formData.get("column"),
    label: formData.get("label"),
    href: formData.get("href"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const count = await db.footerLink.count({ where: { column: parsed.data.column } });
  await db.footerLink.create({ data: { ...parsed.data, sortOrder: count } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/footer-links");
  return { success: true };
}

export async function updateFooterLinkAction(
  linkId: string,
  _prevState: FooterLinkFormState,
  formData: FormData
): Promise<FooterLinkFormState> {
  try {
    await requireSettingsManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = footerLinkSchema.safeParse({
    column: formData.get("column"),
    label: formData.get("label"),
    href: formData.get("href"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await db.footerLink.update({ where: { id: linkId }, data: parsed.data });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/footer-links");
  return { success: true };
}

export async function deleteFooterLinkAction(linkId: string): Promise<{ error?: string }> {
  try {
    await requireSettingsManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.footerLink.delete({ where: { id: linkId } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/footer-links");
  return {};
}
