"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Supabase's own verify endpoint (not our app) redirects failed email links
// here — expired/already-used confirmation, magic-link or password-reset
// links all land as `?error=...` and/or `#error=...` on the Site URL,
// bypassing our /auth/callback route entirely since there's no session to
// hand off. Without this, the user just sees a normal page with a cryptic
// error stuck in the URL and no explanation.
const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "That link has expired or was already used. Please request a new one.",
  access_denied: "That link is invalid or has already been used.",
};

function readHashError() {
  if (typeof window === "undefined" || !window.location.hash) return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.get("error")) return null;
  return { code: params.get("error_code"), description: params.get("error_description") };
}

export function AuthErrorToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hashError = readHashError();
    const code = searchParams.get("error_code") ?? hashError?.code ?? undefined;
    const description = searchParams.get("error_description") ?? hashError?.description ?? undefined;
    if (!code && !description) return;

    toast.error((code && ERROR_MESSAGES[code]) || description || "That link is invalid or has expired.");

    // Strip the error out of the URL (query and hash) so refreshing doesn't re-show it.
    history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
