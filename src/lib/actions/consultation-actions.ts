"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageOrders } from "@/lib/auth/roles";
import { readFiles, saveUploadedImages } from "@/lib/upload";

const COMPANY_EMAIL = "maxlightelectronics@gmail.com";

const consultationSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  location: z.string().min(2, "Please enter your location"),
  consultationType: z.string().min(1, "Choose a consultation type"),
  projectType: z.string().min(1, "Choose a project type"),
  preferredDate: z.string().min(1, "Choose a preferred date"),
  preferredTime: z.string().min(1, "Choose a preferred time"),
  budget: z.string().default(""),
  description: z.string().default(""),
});

export interface ConsultationFormState {
  error?: string;
  success?: boolean;
}

export async function submitConsultationRequestAction(
  _prevState: ConsultationFormState,
  formData: FormData
): Promise<ConsultationFormState> {
  const parsed = consultationSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    location: formData.get("location"),
    consultationType: formData.get("consultationType"),
    projectType: formData.get("projectType"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    budget: formData.get("budget") ?? "",
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  let imageUrls: string[] = [];
  const imageFiles = readFiles(formData, "images");
  if (imageFiles.length > 0) {
    try {
      imageUrls = await saveUploadedImages(imageFiles, "consultations");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  // Saved first, always — the booking is never lost even if outbound email
  // below isn't configured or fails.
  await db.consultationRequest.create({ data: { ...parsed.data, imageUrls } });

  await sendConsultationNotificationEmail({ ...parsed.data, imageCount: imageUrls.length }).catch((e) => {
    console.error("Consultation notification email failed to send:", e);
  });

  return { success: true };
}

async function sendConsultationNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  location: string;
  consultationType: string;
  projectType: string;
  preferredDate: string;
  preferredTime: string;
  budget: string;
  description: string;
  imageCount: number;
}) {
  // No email service configured yet — the booking is still safely stored
  // above and visible at /admin/consultations. Add RESEND_API_KEY to also
  // get these emailed automatically.
  if (!process.env.RESEND_API_KEY) return;

  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "MaxLight Kenya <onboarding@resend.dev>",
      to: COMPANY_EMAIL,
      reply_to: data.email,
      subject: `New consultation request: ${data.consultationType} — ${data.name}`,
      html: [
        `<p><strong>Name:</strong> ${escape(data.name)}</p>`,
        `<p><strong>Email:</strong> ${escape(data.email)}</p>`,
        `<p><strong>Phone:</strong> ${escape(data.phone)}</p>`,
        `<p><strong>Location:</strong> ${escape(data.location)}</p>`,
        `<p><strong>Consultation Type:</strong> ${escape(data.consultationType)}</p>`,
        `<p><strong>Project Type:</strong> ${escape(data.projectType)}</p>`,
        `<p><strong>Preferred Date/Time:</strong> ${escape(data.preferredDate)} at ${escape(data.preferredTime)}</p>`,
        `<p><strong>Budget:</strong> ${escape(data.budget || "—")}</p>`,
        `<p><strong>Description:</strong></p>`,
        `<p>${escape(data.description).replace(/\n/g, "<br>")}</p>`,
        data.imageCount > 0 ? `<p><em>${data.imageCount} image(s) attached — view in the admin dashboard.</em></p>` : "",
      ].join("\n"),
    }),
  });
}

async function requireOrderManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageOrders(role)) {
    throw new Error("You don't have permission to manage consultation requests.");
  }
}

export async function updateConsultationStatusAction(id: string, status: string): Promise<{ error?: string }> {
  try {
    await requireOrderManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.consultationRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/consultations");
  return {};
}

export async function deleteConsultationRequestAction(id: string): Promise<{ error?: string }> {
  try {
    await requireOrderManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.consultationRequest.delete({ where: { id } });
  revalidatePath("/admin/consultations");
  return {};
}
