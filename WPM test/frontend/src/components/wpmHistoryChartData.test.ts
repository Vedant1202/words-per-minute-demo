import { describe, expect, it } from "vitest";
import { buildWpmHistoryChartPoints } from "./wpmHistoryChartData";

describe("buildWpmHistoryChartPoints", () => {
  it("returns empty array when no results have completedAt", () => {
    expect(
      buildWpmHistoryChartPoints([
        {
          id: "1",
          wpm: 50,
          accuracy: 99,
          charactersTyped: 100,
          durationSeconds: 60,
        },
      ])
    ).toEqual([]);
  });

  it("drops invalid dates and sorts oldest → newest by time", () => {
    const points = buildWpmHistoryChartPoints([
      {
        id: "b",
        wpm: 55,
        accuracy: 98,
        charactersTyped: 120,
        durationSeconds: 60,
        completedAt: "2026-03-29T15:00:00.000Z",
      },
      {
        id: "a",
        wpm: 40,
        accuracy: 97,
        charactersTyped: 90,
        durationSeconds: 60,
        completedAt: "2026-03-28T12:00:00.000Z",
      },
      {
        id: "c",
        wpm: 60,
        accuracy: 99,
        charactersTyped: 130,
        durationSeconds: 60,
        completedAt: "not-a-date",
      },
    ]);
    expect(points).toHaveLength(2);
    expect(points.map((p) => p.id)).toEqual(["a", "b"]);
    expect(points.map((p) => p.wpm)).toEqual([40, 55]);
    expect(points[0]!.t).toBeLessThan(points[1]!.t);
  });
});
