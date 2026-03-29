import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StoredResult } from "../types/api";
import { buildWpmHistoryChartPoints } from "./wpmHistoryChartData";

function formatAxisTick(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTooltipLabel(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type Props = {
  pastResults: StoredResult[];
};

export function WpmHistoryChart({ pastResults }: Props) {
  const data = buildWpmHistoryChartPoints(pastResults);

  if (data.length === 0) {
    return (
      <p className="text-base-content/60 text-sm">
        Complete a timed test to record WPM with a timestamp; past runs will
        appear here.
      </p>
    );
  }

  return (
    <div
      className="h-64 w-full min-w-0"
      data-testid="wpm-history-chart"
      aria-label="WPM over time chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatAxisTick}
            minTickGap={28}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="wpm"
            width={40}
            domain={[0, "dataMax + 2"]}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            labelFormatter={(value) =>
              formatTooltipLabel(Number(value as number))
            }
            formatter={(value) => [`${value}`, "WPM"]}
          />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="oklch(var(--p))"
            strokeWidth={2}
            dot={{ r: 3, fill: "oklch(var(--p))" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
