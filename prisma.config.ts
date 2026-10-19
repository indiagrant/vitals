// Prisma CLI configuration (migrations, db pull, studio, etc.)
// This is only used by the `prisma` CLI — your running app's database
// connection is configured separately, in server code, via a driver
// adapter (see CLAUDE.md's "Backend" section once that's written up).
//
// Deliberately uses DIRECT_URL, not DATABASE_URL: migrations need a
// direct connection to Postgres, not the pgbouncer-pooled one the app
// uses at runtime.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
