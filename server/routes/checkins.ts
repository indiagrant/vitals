import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";

export const checkinsRouter = Router();

// Each dimension is a 1-5 integer (matches DimensionBar's 5-step scale).
// Defining this once and reusing it for all six fields means the range
// check only has to be written — and get right — in one place.
const dimensionScore = z.number().int().min(1).max(5);

const submitCheckInSchema = z.object({
  employeeId: z.string().min(1),
  sprintId: z.string().min(1),
  metrics: z.object({
    workLifeBalance: dimensionScore,
    communication: dimensionScore,
    managerSupport: dimensionScore,
    teamCollaboration: dimensionScore,
    workload: dimensionScore,
    jobSatisfaction: dimensionScore,
  }),
  win: z.string().optional(),
  pain: z.string().optional(),
});

// POST /api/checkins — the real write path, replacing mockData.ts's
// submitCheckIn(). Create-or-update: submitting again for the same
// employee+sprint overwrites that sprint's scores (matches the old
// mock behaviour) rather than erroring on the unique constraint.
checkinsRouter.post("/", async (req, res) => {
  const parsed = submitCheckInSchema.safeParse(req.body);
  if (!parsed.success) {
    // Never trust a request body — safeParse gives back either valid,
    // typed data or a precise list of what was wrong, with no throw.
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
  }
  const { employeeId, sprintId, metrics, win, pain } = parsed.data;

  // Confirm both ids are real before writing anything — a typo'd id should
  // fail with a clear 404, not a cryptic foreign-key error from Postgres.
  const [employee, sprint] = await Promise.all([
    prisma.employee.findUnique({ where: { id: employeeId } }),
    prisma.sprint.findUnique({ where: { id: sprintId } }),
  ]);
  if (!employee) return res.status(404).json({ error: `No employee with id "${employeeId}"` });
  if (!sprint) return res.status(404).json({ error: `No sprint with id "${sprintId}"` });

  const checkIn = await prisma.checkIn.upsert({
    where: { employeeId_sprintId: { employeeId, sprintId } },
    update: { ...metrics },
    create: { employeeId, sprintId, ...metrics, prompts: [] },
  });

  const newReflections = [
    ...(win ? [{ kind: "WIN" as const, tag: "check-in", title: win, detail: "" }] : []),
    ...(pain ? [{ kind: "PAIN" as const, tag: "check-in", title: pain, detail: "" }] : []),
  ];
  if (newReflections.length > 0) {
    await prisma.reflection.createMany({
      data: newReflections.map((r) => ({ ...r, checkInId: checkIn.id })),
    });
  }

  const result = await prisma.checkIn.findUniqueOrThrow({
    where: { id: checkIn.id },
    include: { reflections: true },
  });

  // 200, not 201: this endpoint is create-or-update (an upsert), so "201
  // Created" wouldn't always be accurate — 200 with the resulting resource
  // covers both cases honestly.
  res.status(200).json(result);
});
