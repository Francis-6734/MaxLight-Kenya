"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { updatePasswordAction, type ResetPasswordState } from "@/lib/actions/auth-actions";

const initialState: ResetPasswordState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState);

  return (
    <AuthCard>
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Account Recovery</p>
        <h1 className="font-heading text-3xl">Set a New Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a new password for your account.</p>
      </div>

      <form action={formAction} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} placeholder="Re-enter your new password" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthCard>
  );
}
