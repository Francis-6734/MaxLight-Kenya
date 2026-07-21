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
  // On Vercel every concurrent serverless invocation is its own isolated
  // process with its own pool — globalForPrisma caching only helps within a
  // single warm instance, not across them. DATABASE_URL must point at
  // Supabase's Transaction Pooler (port 6543), not the Session Pooler (5432):
  // session mode hands out one dedicated Postgres connection per client for
  // its whole lifetime and hard-caps at pool_size, so a handful of concurrent
  // instances blow past the limit (EMAXCONNSESSION). Transaction mode
  // multiplexes many logical clients over a small number of real backend
  // connections, which is what serverless needs. Keep `max` low per instance
  // regardless — the pooling that matters happens in PgBouncer, not here.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 3 });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
