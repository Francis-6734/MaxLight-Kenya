"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageContent } from "@/lib/auth/roles";
import { readOptionalFile, saveUploadedImage } from "@/lib/upload";

const projectSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  category: z.string().min(1),
  location: z.string().min(1),
  completionDate: z.string().min(1),
  servicesDelivered: z.string().min(1),
  clientTestimonial: z.string().optional().or(z.literal("")),
  clientName: z.string().optional().or(z.literal("")),
  gradient: z.string().min(1),
  icon: z.string().min(1),
  published: z.boolean().default(true),
});

export interface ProjectFormState {
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
    category: formData.get("category"),
    location: formData.get("location"),
    completionDate: formData.get("completionDate"),
    servicesDelivered: formData.get("servicesDelivered"),
    clientTestimonial: formData.get("clientTestimonial") ?? "",
    clientName: formData.get("clientName") ?? "",
    gradient: formData.get("gradient"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createProjectAction(_prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = projectSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A project with this slug already exists." };

  let imageUrl: string | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "projects");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const { clientTestimonial, clientName, ...rest } = parsed.data;
  await db.project.create({
    data: { ...rest, clientTestimonial: clientTestimonial || null, clientName: clientName || null, imageUrl },
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function updateProjectAction(
  projectId: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = projectSchema.safeParse(parseInput(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== projectId) return { error: "A project with this slug already exists." };

  let imageUrl: string | null | undefined;
  const imageFile = readOptionalFile(formData, "image");
  if (imageFile) {
    try {
      imageUrl = await saveUploadedImage(imageFile, "projects");
    } catch (e) {
      return { error: (e as Error).message };
    }
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  const { clientTestimonial, clientName, ...rest } = parsed.data;
  await db.project.update({
    where: { id: projectId },
    data: {
      ...rest,
      clientTestimonial: clientTestimonial || null,
      clientName: clientName || null,
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    },
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProjectAction(projectId: string): Promise<{ error?: string }> {
  try {
    await requireContentManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.project.delete({ where: { id: projectId } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return {};
}
