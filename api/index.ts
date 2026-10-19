// Vercel's serverless entry point. Vercel calls this file's default export
// directly on each request — no app.listen() needed, Vercel's own runtime
// is the HTTP server. Everything that matters lives in server/app.ts; this
// file just hands it over.
import app from "../server/app.js";

export default app;
