// A single shared Prisma Client instance, reused across every request.
// Creating a new PrismaClient per request would open a new connection
// pool each time — wasteful, and exactly what DATABASE_URL's pgbouncer
// pooling already exists to avoid.
//
// Note: no `import "dotenv/config"` here — in production (Vercel),
// DATABASE_URL is injected directly into process.env by the platform;
// dotenv is a local-dev-only convenience, loaded once in server/index.ts
// (the local dev entry point) before this module is imported.

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Fail loudly at startup rather than letting pg silently fall back to its
// default of 127.0.0.1:5432 — which surfaces much later, per-request, as a
// misleading "Can't reach database server" error (exactly what happened
// on Vercel before DATABASE_URL was added to its environment variables).
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Locally, add it to .env; on Vercel, add it under Settings → Environment Variables and redeploy.",
  );
}

const adapter = new PrismaPg(databaseUrl);

export const prisma = new PrismaClient({ adapter });
