import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Standard Next.js dev pattern: reuse a single PrismaClient across hot reloads
// instead of exhausting the Supabase connection pool on every module reload.
// The adapter (and its pg.Pool) must only ever be constructed inside this
// lazy branch — building it as a separate statement above the `??` meant it
// ran on every Turbopack hot-reload regardless of whether the cached client
// was reused, quietly climbing toward Supabase's 15-connection pooler limit
// until the app started failing with "Can't reach database server".
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  // Supabase's session-pooler connection limit is small (15 on this project) —
  // cap the pool well under that so this single-process app leaves headroom
  // for migrations, seed scripts, and the Supabase dashboard's own connections.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
