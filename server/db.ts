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

const adapter = new PrismaPg(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({ adapter });
