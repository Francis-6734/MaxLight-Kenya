"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

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
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account. Please try again." };

  await db.user.create({ data: { id: data.user.id, name, email, role: "CUSTOMER" } });

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

  redirect("/account/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Kicks off the OAuth redirect (Google/Facebook). The actual Client ID/Secret
 * for each provider live in the Supabase dashboard (Authentication →
 * Providers), not in this app — this just asks Supabase for the provider's
 * consent-screen URL and sends the browser there. Completion happens in
 * src/app/auth/callback/route.ts once the provider redirects back.
 */
export async function signInWithOAuthAction(provider: "google" | "facebook") {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect(`/sign-in?error=${encodeURIComponent(error?.message ?? "Could not start sign-in.")}`);
  }

  redirect(data.url);
}
