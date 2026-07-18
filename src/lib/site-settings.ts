import { db } from "@/lib/db";

/** Fetches the singleton site settings row, creating it with schema defaults if missing. */
export async function getSiteSettings() {
  const existing = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return db.siteSettings.create({ data: { id: "singleton" } });
}
