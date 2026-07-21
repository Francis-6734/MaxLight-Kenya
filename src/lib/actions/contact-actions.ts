"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageOrders } from "@/lib/auth/roles";

const COMPANY_EMAIL = "maxlightelectronics@gmail.com";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().default(""),
  subject: z.string().min(2, "Please enter a subject"),
  message: z.string().min(10, "Please tell us a bit more"),
});

export interface ContactFormState {
  error?: string;
  success?: boolean;
}

export async function submitContactMessageAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  // Saved first, always — the enquiry is never lost even if outbound email
  // below isn't configured or fails.
  await db.contactMessage.create({ data: parsed.data });

  await sendContactNotificationEmail(parsed.data).catch((e) => {
    console.error("Contact notification email failed to send:", e);
  });

  return { success: true };
}

async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  // No email service configured yet — the message is still safely stored
  // above and visible at /admin/messages. Add RESEND_API_KEY to also get
  // these emailed automatically.
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
      subject: `New enquiry: ${data.subject}`,
      html: [
        `<p><strong>Name:</strong> ${escape(data.name)}</p>`,
        `<p><strong>Email:</strong> ${escape(data.email)}</p>`,
        `<p><strong>Phone:</strong> ${escape(data.phone || "—")}</p>`,
        `<p><strong>Subject:</strong> ${escape(data.subject)}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${escape(data.message).replace(/\n/g, "<br>")}</p>`,
      ].join("\n"),
    }),
  });
}

async function requireOrderManager() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  if (!role || !canManageOrders(role)) {
    throw new Error("You don't have permission to manage messages.");
  }
}

export async function markContactMessageReadAction(id: string, read: boolean): Promise<{ error?: string }> {
  try {
    await requireOrderManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  return {};
}

export async function deleteContactMessageAction(id: string): Promise<{ error?: string }> {
  try {
    await requireOrderManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  return {};
}
