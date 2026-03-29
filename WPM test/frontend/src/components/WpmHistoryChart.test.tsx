import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { StoredResult } from "../types/api";
import { WpmHistoryChart } from "./WpmHistoryChart";

const sampleResults: StoredResult[] = [
  {
    id: "1",
    wpm: 42,
    accuracy: 98,
    charactersTyped: 200,
    durationSeconds: 60,
    completedAt: "2026-03-28T12:00:00.000Z",
  },
  {
    id: "2",
    wpm: 55,
    accuracy: 99,
    charactersTyped: 220,
    durationSeconds: 60,
    completedAt: "2026-03-29T18:30:00.000Z",
  },
];

describe("WpmHistoryChart", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows guidance when there are no dated results", () => {
    render(
      <WpmHistoryChart
        pastResults={[
          {
            id: "x",
            wpm: 10,
            accuracy: 90,
            charactersTyped: 50,
            durationSeconds: 60,
          },
        ]}
      />
    );
    expect(
      screen.getByText(/Complete a timed test to record WPM/i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("wpm-history-chart")).not.toBeInTheDocument();
  });

  it("renders chart container when dated results exist", () => {
    render(<WpmHistoryChart pastResults={sampleResults} />);
    expect(screen.getByTestId("wpm-history-chart")).toBeInTheDocument();
  });
});
