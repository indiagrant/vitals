import { submitCheckIn, getEmployeeCheckIns, ApiError } from "./api";
import type { HealthMetrics } from "@/types";

const metrics: HealthMetrics = {
  workLifeBalance: 4,
  communication: 4,
  managerSupport: 4,
  teamCollaboration: 4,
  workload: 4,
  jobSatisfaction: 4,
};

describe("submitCheckIn", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("POSTs to /api/checkins with the right shape and returns the parsed result on success", async () => {
    const mockResult = { id: 1, employeeId: "E001", sprintId: "S24", ...metrics, prompts: [], reflections: [] };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResult), { status: 200 }),
    );

    const result = await submitCheckIn("E001", "S24", metrics, "a win", "a pain");

    expect(fetch).toHaveBeenCalledWith(
      "/api/checkins",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: "E001", sprintId: "S24", metrics, win: "a win", pain: "a pain" }),
      }),
    );
    expect(result).toEqual(mockResult);
  });

  it("throws an ApiError carrying the status and details when the server rejects the request", async () => {
    const errorBody = { error: "Invalid request body", details: { fieldErrors: { metrics: ["Too big"] } } };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(errorBody), { status: 400 }),
    );

    try {
      await submitCheckIn("E001", "S24", metrics, "", "");
      expect.unreachable("expected submitCheckIn to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiError = err as ApiError;
      expect(apiError.message).toBe("Invalid request body");
      expect(apiError.status).toBe(400);
      expect(apiError.details).toEqual(errorBody.details);
    }
  });

  it("falls back to a generic message if the error response has no `error` field", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 500 }));

    await expect(submitCheckIn("E001", "S24", metrics, "", "")).rejects.toThrow("Failed to submit check-in");
  });
});

describe("getEmployeeCheckIns", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("GETs /api/employees/:id/checkins and returns the parsed array on success", async () => {
    const mockResult = [{ id: 1, employeeId: "E001", sprintId: "S24", ...metrics, prompts: [], reflections: [], sprint: { id: "S24", label: "Aug 19 → Sep 1", order: 4 } }];
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(mockResult), { status: 200 }));

    const result = await getEmployeeCheckIns("E001");

    expect(fetch).toHaveBeenCalledWith("/api/employees/E001/checkins");
    expect(result).toEqual(mockResult);
  });

  it("throws an ApiError when the employee isn't found", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'No employee with id "NOPE"' }), { status: 404 }),
    );

    try {
      await getEmployeeCheckIns("NOPE");
      expect.unreachable("expected getEmployeeCheckIns to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(404);
    }
  });
});
