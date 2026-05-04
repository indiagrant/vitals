import { useState, useEffect } from "react";

import { AppSidebar, type NavId } from "@/components/vitals/AppSidebar";
import { TopBar } from "@/components/vitals/TopBar";
import { Eyebrow } from "@/components/vitals/Eyebrow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { VITALS_EMPLOYEES, vitalsEmployee } from "@/data/mockData";
import type { ViewRole } from "@/types";

export default function App() {
  const [role, setRole] = useState<ViewRole>("employee");
  const [employeeId, setEmployeeId] = useState<string>("E001");
  const [view, setView] = useState<NavId>("sprint");
  const [sprint, setSprint] = useState<string>("S24");

  useEffect(() => {
    setView(role === "admin" ? "team" : "sprint");
  }, [role]);

  const employee = vitalsEmployee(employeeId)!;

  return (
    <div className="min-h-screen w-screen flex bg-background text-foreground">
      <AppSidebar
        role={role}
        view={view}
        onViewChange={setView}
        employee={employee}
        employees={VITALS_EMPLOYEES}
        onEmployeeChange={setEmployeeId}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          role={role}
          employee={employee}
          sprint={sprint}
          onSprintChange={setSprint}
        />

        <main className="flex-1 px-10 py-8">
          <div>
            <Eyebrow className="mb-3 block">Welcome to Vitals</Eyebrow>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">
              The shell is up. Build views into the placeholder below.
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mb-8">
              The sidebar nav, sprint pager, and user switcher all work. Replace
              this <code className="font-mono text-xs">&lt;main&gt;</code> content
              with your <code className="font-mono text-xs">&lt;SprintView /&gt;</code>,{" "}
              <code className="font-mono text-xs">&lt;TeamOverview /&gt;</code>, etc.
            </p>

            <Card>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Eyebrow>Dev-only</Eyebrow>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRole(role === "employee" ? "admin" : "employee")}
                >
                  Switch to {role === "employee" ? "Admin" : "Employee"} view
                </Button>
                <span className="text-xs text-muted-foreground">
                  Currently:{" "}
                  <span className="font-medium text-foreground">{role}</span>
                  {" · "}view: <span className="font-mono">{view}</span>
                  {" · "}sprint: <span className="font-mono">{sprint}</span>
                </span>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
