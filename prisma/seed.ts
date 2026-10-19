// Seed script — populates a fresh database with your existing mock data.
// Run via `npx prisma db seed` (wired up in prisma.config.ts below).
//
// Safe to re-run: it wipes the relevant tables first, then reinserts
// everything from mockData.ts, so the database always ends up matching
// mockData.ts exactly. That's the right behaviour for a dev/demo seed
// script — never do a blind wipe like this against a production database.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js"; // generated output, not a TS source file
import {
  VITALS_EMPLOYEES,
  VITALS_SPRINTS,
  SPRINT_DATES,
  VITALS_SURVEYS,
  VITALS_TICKETS,
  VITALS_REFLECTIONS,
} from "../src/data/mockData";
import type { TicketStatus, TicketType } from "../src/types";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Prisma's generated enums use SCREAMING_SNAKE_CASE; mockData.ts uses
// hyphenated strings (TypeScript union types, not real enums) — this is
// the small translation layer flagged back when we designed the schema.
const STATUS_MAP: Record<TicketStatus, "DONE" | "IN_PROGRESS" | "BLOCKED" | "CARRIED_OVER"> = {
  "done": "DONE",
  "in-progress": "IN_PROGRESS",
  "blocked": "BLOCKED",
  "carried-over": "CARRIED_OVER",
};

const TYPE_MAP: Record<TicketType, "FEATURE" | "BUG" | "CHORE" | "SPIKE" | "RFC" | "PERF" | "INCIDENT"> = {
  "feature": "FEATURE",
  "bug": "BUG",
  "chore": "CHORE",
  "spike": "SPIKE",
  "rfc": "RFC",
  "perf": "PERF",
  "incident": "INCIDENT",
};

async function main() {
  console.log("Wiping existing data…");
  // Children before parents — Postgres won't let you delete a row that
  // something else still has a foreign key pointing at.
  await prisma.reflection.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.employee.deleteMany();

  console.log("Seeding sprints…");
  for (const [index, sprintId] of VITALS_SPRINTS.entries()) {
    await prisma.sprint.create({
      data: { id: sprintId, label: SPRINT_DATES[sprintId], order: index },
    });
  }

  console.log("Seeding employees…");
  for (const emp of VITALS_EMPLOYEES) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        initials: emp.initials,
        tenure: emp.tenure,
        isAdmin: emp.isAdmin ?? false,
      },
    });
  }

  console.log("Seeding check-ins, reflections, and tickets…");
  for (const emp of VITALS_EMPLOYEES) {
    for (const sprintId of VITALS_SPRINTS) {
      const metrics = VITALS_SURVEYS[emp.id]?.[sprintId];
      if (!metrics) continue; // not every employee has data for every sprint

      const reflection = VITALS_REFLECTIONS[emp.id]?.[sprintId];

      // A nested write: creates the CheckIn row and all its Reflection rows
      // together, in one call — Prisma wires up the checkInId automatically.
      await prisma.checkIn.create({
        data: {
          employeeId: emp.id,
          sprintId,
          workLifeBalance: metrics.workLifeBalance,
          communication: metrics.communication,
          managerSupport: metrics.managerSupport,
          teamCollaboration: metrics.teamCollaboration,
          workload: metrics.workload,
          jobSatisfaction: metrics.jobSatisfaction,
          prompts: reflection?.prompts ?? [],
          reflections: {
            create: [
              ...(reflection?.wins ?? []).map((r) => ({ kind: "WIN" as const, ...r })),
              ...(reflection?.pains ?? []).map((r) => ({ kind: "PAIN" as const, ...r })),
            ],
          },
        },
      });

      const tickets = VITALS_TICKETS[emp.id]?.[sprintId] ?? [];
      for (const ticket of tickets) {
        await prisma.ticket.create({
          data: {
            id: ticket.id,
            title: ticket.title,
            status: STATUS_MAP[ticket.status],
            estimate: ticket.estimate,
            actual: ticket.actual,
            points: ticket.points,
            type: TYPE_MAP[ticket.type],
            note: ticket.note,
            employeeId: emp.id,
            sprintId,
          },
        });
      }
    }
  }

  const counts = {
    employees: await prisma.employee.count(),
    sprints: await prisma.sprint.count(),
    checkIns: await prisma.checkIn.count(),
    reflections: await prisma.reflection.count(),
    tickets: await prisma.ticket.count(),
  };
  console.log("Done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
