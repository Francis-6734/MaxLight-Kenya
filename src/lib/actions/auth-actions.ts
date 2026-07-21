"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

const ALREADY_REGISTERED_ERROR = "An account with this email already exists. Please sign in instead.";

/** Only ever redirect to a same-origin path — never follow an attacker-supplied absolute/external callbackUrl. */
function safeCallbackUrl(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

const signUpSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface SignUpState {
  error?: string;
  success?: boolean;
  needsEmailConfirmation?: boolean;
}

export async function signUpAction(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, email, password } = parsed.data;

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account. Please try again." };

  // When the email is already registered, Supabase returns the existing user
  // with an empty `identities` array and no error, instead of an error — this
  // is deliberate on their end (prevents leaking which emails have accounts),
  // but we still need to catch it before inserting or it hits our unique
  // constraint on User.email and crashes the request.
  if (data.user.identities && data.user.identities.length === 0) {
    return { error: ALREADY_REGISTERED_ERROR };
  }

  try {
    await db.user.create({ data: { id: data.user.id, name, email, role: "CUSTOMER" } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: ALREADY_REGISTERED_ERROR };
    }
    throw e;
  }

  if (!data.session) {
    // Project has "confirm email" enabled — no session yet until they click the link.
    return { success: true, needsEmailConfirmation: true };
  }

  redirect("/account/dashboard");
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export interface SignInState {
  error?: string;
}

export async function signInAction(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Invalid email or password" };

  redirect(safeCallbackUrl(formData.get("callbackUrl"), "/account/dashboard"));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

const forgotPasswordSchema = z.object({ email: z.string().email("Enter a valid email address") });

export interface ForgotPasswordState {
  error?: string;
  success?: boolean;
}

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address" };

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  // Always report success regardless of whether the email exists — same
  // enumeration-prevention reasoning Supabase applies to sign-up, and this
  // call itself never errors just because the address isn't registered.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  return { success: true };
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface ResetPasswordState {
  error?: string;
}

export async function updatePasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your password reset link has expired. Please request a new one." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  redirect("/account/dashboard");
}

/**
 * Kicks off the Google OAuth redirect. The actual Client ID/Secret live in
 * the Supabase dashboard (Authentication → Providers), not in this app —
 * this just asks Supabase for Google's consent-screen URL and sends the
 * browser there. Completion happens in src/app/auth/callback/route.ts once
 * Google redirects back.
 */
export async function signInWithOAuthAction(provider: "google", formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const next = safeCallbackUrl(formData.get("callbackUrl"), "/account/dashboard");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });

  if (error || !data.url) {
    redirect(`/sign-in?error=${encodeURIComponent(error?.message ?? "Could not start sign-in.")}`);
  }

  redirect(data.url);
}
