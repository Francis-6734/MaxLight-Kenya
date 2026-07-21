"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { requestPasswordResetAction, type ForgotPasswordState } from "@/lib/actions/auth-actions";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <AuthCard>
        <div className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-gold" strokeWidth={1.5} />
          <h1 className="mt-4 font-heading text-2xl">Check Your Email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for that email address, we&rsquo;ve sent a link to reset your password.
          </p>
          <Link href="/sign-in" className="mt-6 inline-block font-medium text-foreground underline underline-offset-2">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Account Recovery</p>
        <h1 className="font-heading text-3xl">Forgot Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email address on your account and we&rsquo;ll send you a link to reset your password.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? "Sending link..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
