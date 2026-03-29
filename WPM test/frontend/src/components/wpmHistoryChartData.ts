import type { StoredResult } from "../types/api";

export type WpmHistoryPoint = {
  t: number;
  wpm: number;
  id: string;
};

export function buildWpmHistoryChartPoints(
  results: StoredResult[]
): WpmHistoryPoint[] {
  const withTime = results
    .map((r) => {
      if (!r.completedAt) return null;
      const t = new Date(r.completedAt).getTime();
      if (!Number.isFinite(t)) return null;
      return { t, wpm: r.wpm, id: r.id };
    })
    .filter((x): x is WpmHistoryPoint => x !== null);
  return withTime.sort((a, b) => a.t - b.t);
}
