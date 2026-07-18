"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { signUpAction, type SignUpState } from "@/lib/actions/auth-actions";

const initialState: SignUpState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  if (state.needsEmailConfirmation) {
    return (
      <AuthCard>
        <div className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-gold" strokeWidth={1.5} />
          <h1 className="mt-4 font-heading text-2xl">Check Your Email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&rsquo;ve sent a confirmation link to your email address. Click it to activate your account, then sign
            in.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block font-medium text-foreground underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Join MaxLight</p>
        <h1 className="font-heading text-3xl">Create Your Account</h1>
      </div>

      <div className="mt-8">
        <SocialAuthButtons />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase">Or</span>
        <Separator className="flex-1" />
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required placeholder="Jane Wanjiru" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
