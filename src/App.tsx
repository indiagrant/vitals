import { useState, useEffect } from "react";

import { AppSidebar, type NavId } from "@/components/vitals/AppSidebar";
import { TopBar } from "@/components/vitals/TopBar";

import { SprintView } from "@/pages/SprintView";
import { CheckInView } from "@/pages/CheckInView";
import { PatternsView } from "@/pages/PatternsView";
import { RetroPrepView } from "@/pages/RetroPrepView";
import { PlaceholderView } from "@/pages/PlaceholderView";
import { TeamOverviewView } from "@/pages/TeamOverviewView";

import { VITALS_EMPLOYEES, vitalsEmployee } from "@/data/mockData";
import type { ViewRole } from "@/types";

export default function App() {
  const [employeeId, setEmployeeId] = useState<string>("E001");
  const [view, setView] = useState<NavId>("sprint");
  const [sprint, setSprint] = useState<string>("S24");
  // Read whatever index.html's inline script already applied to <html>, so
  // this stays in sync with it instead of independently re-deciding and
  // risking a mismatch.
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  const employee = vitalsEmployee(employeeId)!;
  const role: ViewRole = employee.isAdmin ? "admin" : "employee";

  // Every user (admin or not) lands on their own Sprint page first —
  // admin-only views are opt-in via the sidebar's Admin section.
  useEffect(() => {
    setView("sprint");
  }, [employeeId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vitals-theme", theme);
  }, [theme]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground">
      <AppSidebar
        role={role}
        view={view}
        onViewChange={setView}
        employee={employee}
        employees={VITALS_EMPLOYEES}
        onEmployeeChange={setEmployeeId}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <TopBar
          view={view}
          employee={employee}
          sprint={sprint}
          onSprintChange={setSprint}
        />

        <main className="flex-1 px-10 py-8 flex flex-col gap-10">
          {/* Employee pages — available to everyone, admins included */}
          {view === "sprint" && <SprintView employee={employee} sprint={sprint} />}
          {view === "checkin" && (
            <CheckInView employee={employee} sprint={sprint} onDone={() => setView("sprint")} />
          )}
          {view === "patterns" && <PatternsView employee={employee} />}
          {view === "retro" && <RetroPrepView employee={employee} sprint={sprint} />}
          {view === "history" && (
            <PlaceholderView
              title="History"
              description="Your past check-ins and reflections."
            />
          )}

          {/* Admin-only pages — Team overview is built, the rest are placeholders */}
          {role === "admin" && view === "team" && <TeamOverviewView />}
          {role === "admin" &&
            (view === "dimensions" || view === "sprint-health" || view === "trend" || view === "settings") && (
              <PlaceholderView
                title={`Admin · ${view}`}
                description="Admin views land in a later milestone."
              />
            )}
        </main>
      </div>
    </div>
  );
}
