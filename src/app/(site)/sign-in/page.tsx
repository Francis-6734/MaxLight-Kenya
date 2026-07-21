"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { signInAction, type SignInState } from "@/lib/actions/auth-actions";

const initialState: SignInState = {};

function SignInForm() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <AuthCard>
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Welcome Back</p>
        <h1 className="font-heading text-3xl">Sign In</h1>
      </div>

      <div className="mt-8">
        <SocialAuthButtons callbackUrl={callbackUrl} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase">Or</span>
        <Separator className="flex-1" />
      </div>

      <form action={formAction} className="space-y-4">
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        {oauthError && <p className="text-sm text-destructive">{oauthError}</p>}
        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&rsquo;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-2">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
