import { Router } from "express";
import { prisma } from "../db.js";

export const employeesRouter = Router();

// GET /api/employees — everyone, for the user switcher / admin views.
employeesRouter.get("/", async (_req, res) => {
  const employees = await prisma.employee.findMany({ orderBy: { id: "asc" } });
  res.json(employees);
});

// GET /api/employees/:id/checkins — one employee's full check-in history,
// across every sprint, each with its wins/pains attached. This is the
// read path History/Patterns/Sprint will eventually use instead of
// reading VITALS_SURVEYS/VITALS_REFLECTIONS directly from mockData.ts.
employeesRouter.get("/:id/checkins", async (req, res) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return res.status(404).json({ error: `No employee with id "${id}"` });
  }

  const checkIns = await prisma.checkIn.findMany({
    where: { employeeId: id },
    include: { reflections: true, sprint: true },
    orderBy: { sprint: { order: "asc" } },
  });

  res.json(checkIns);
});
