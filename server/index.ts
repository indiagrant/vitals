// Local dev entry point only — starts a real, long-running HTTP server.
// Never used in production: Vercel calls api/index.ts's exported Express
// app directly, per-request, without this listen() step at all.
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
