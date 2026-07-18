import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import type { Role } from "@/lib/auth/roles";

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

/** Server-only. Resolves the signed-in Supabase user plus their app profile (role, name). */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await db.user.findUnique({ where: { id: user.id } });
  if (!profile) return null;

  return { id: profile.id, email: profile.email, name: profile.name, role: profile.role as Role };
}
