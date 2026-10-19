import express from "express";
import { employeesRouter } from "./routes/employees.js";
import { checkinsRouter } from "./routes/checkins.js";

const app = express();

// Parses incoming JSON request bodies into req.body — without this,
// req.body would be undefined for every POST.
app.use(express.json());

// A trivial endpoint to confirm the server (and its DB connection, via
// whichever route you hit next) is actually up — handy for a quick
// curl/browser check, and for Vercel's own health probes later.
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/employees", employeesRouter);
app.use("/api/checkins", checkinsRouter);

export default app;
