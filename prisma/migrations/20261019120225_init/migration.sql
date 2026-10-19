-- CreateEnum
CREATE TYPE "ReflectionKind" AS ENUM ('WIN', 'PAIN');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('DONE', 'IN_PROGRESS', 'BLOCKED', 'CARRIED_OVER');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('FEATURE', 'BUG', 'CHORE', 'SPIKE', 'RFC', 'PERF', 'INCIDENT');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "tenure" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "workLifeBalance" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "managerSupport" INTEGER NOT NULL,
    "teamCollaboration" INTEGER NOT NULL,
    "workload" INTEGER NOT NULL,
    "jobSatisfaction" INTEGER NOT NULL,
    "prompts" TEXT[],

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "id" SERIAL NOT NULL,
    "checkInId" INTEGER NOT NULL,
    "kind" "ReflectionKind" NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "estimate" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "type" "TicketType" NOT NULL,
    "note" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_employeeId_sprintId_key" ON "CheckIn"("employeeId", "sprintId");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
