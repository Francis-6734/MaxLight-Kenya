import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Where Google/Facebook (via Supabase) redirect back to after the user
 * approves the consent screen. Exchanges the auth code for a session, then
 * creates the matching profile row on first login — email/password signups
 * create their profile in signUpAction, but OAuth users land here first with
 * no row in our User table yet.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const existing = await db.user.findUnique({ where: { id: data.user.id } });
      if (!existing) {
        const meta = data.user.user_metadata as { full_name?: string; name?: string };
        await db.user.create({
          data: {
            id: data.user.id,
            email: data.user.email ?? "",
            name: meta.full_name ?? meta.name ?? null,
            role: "CUSTOMER",
          },
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent("Could not sign in with that provider.")}`);
}
