import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPersonalBest, submitPersonalBest } from "./client";

describe("personal-best API client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchPersonalBest calls GET /personal-best", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ personalBest: null }),
    } as Response);

    const result = await fetchPersonalBest();

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:3000/personal-best"
    );
    expect(result).toEqual({ personalBest: null });
  });

  it("submitPersonalBest calls POST /personal-best with payload", async () => {
    const payload = {
      resultId: "11111111-1111-4111-8111-111111111111",
      wpm: 58,
      accuracy: 98.5,
      charactersTyped: 280,
      durationSeconds: 60,
      completedAt: "2026-03-30T10:00:00.000Z",
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        improved: true,
        current: {
          id: "pb-1",
          ...payload,
        },
      }),
    } as Response);

    const result = await submitPersonalBest(payload);

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:3000/personal-best",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    expect(result.improved).toBe(true);
    expect(result.current?.resultId).toBe(payload.resultId);
  });
});
