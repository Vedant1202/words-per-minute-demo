import { useCallback, useLayoutEffect, useRef } from "react";
import { useTypingTest, DURATION_SEC } from "../hooks/useTypingTest";
import { WpmHistoryChart } from "./WpmHistoryChart";

/** Minimum visible rows for the typing textarea (expanded by layout effect). */
export const MIN_TYPING_TEXTAREA_ROWS = 3;

function formatTime(seconds: number): string {
  const s = Math.ceil(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function TypingTest() {
  const {
    paragraph,
    loadingParagraph,
    loadError,
    input,
    onInputChange,
    phase,
    timeRemaining,
    wpm,
    accuracy,
    charactersTyped,
    finalSummary,
    submitting,
    submitError,
    pastResults,
    resultsError,
    restart,
  } = useTypingTest();

  const target = paragraph?.text ?? "";
  const progressPct =
    phase === "running" || phase === "done"
      ? Math.min(100, ((DURATION_SEC - timeRemaining) / DURATION_SEC) * 100)
      : 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-4 pb-12">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">WPM Test</h1>
        <p className="text-base-content/70 mt-1 text-sm">
          {DURATION_SEC}s session · timer starts on your first keystroke
        </p>
      </header>

      {loadError && (
        <div role="alert" className="alert alert-error">
          <span>{loadError}</span>
        </div>
      )}

      <div className="card bg-base-200 shadow-md">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">Type this</h2>
          {loadingParagraph ? (
            <div className="flex flex-col gap-2">
              <span className="loading loading-dots loading-md" />
              <span className="text-base-content/60 text-sm">
                Loading paragraph…
              </span>
            </div>
          ) : target ? (
            <ParagraphPreview target={target} typed={input} phase={phase} />
          ) : (
            <p className="text-base-content/60">No paragraph loaded.</p>
          )}

          <label className="form-control w-full">
            <span className="label-text mb-1">Your typing</span>
            <TypingTextarea
              value={input}
              onChange={onInputChange}
              disabled={
                loadingParagraph ||
                !paragraph ||
                phase === "done" ||
                !!loadError
              }
              placeholder={
                loadingParagraph || !paragraph
                  ? "Wait for paragraph…"
                  : phase === "done"
                    ? "Session complete"
                    : "Start typing…"
              }
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="stats stats-vertical border border-base-300 bg-base-100 shadow-sm sm:stats-horizontal">
              <div className="stat place-items-center py-3">
                <div className="stat-title">Time left</div>
                <div className="stat-value text-xl tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="stat place-items-center py-3">
                <div className="stat-title">WPM</div>
                <div className="stat-value text-xl tabular-nums">{wpm}</div>
              </div>
              <div className="stat place-items-center py-3">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value text-xl tabular-nums">
                  {accuracy}%
                </div>
              </div>
              <div className="stat place-items-center py-3">
                <div className="stat-title">Characters</div>
                <div className="stat-value text-xl tabular-nums">
                  {charactersTyped}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <progress
                className="progress progress-primary w-full"
                value={progressPct}
                max={100}
                aria-label="Session progress"
              />
              <button
                type="button"
                className="btn btn-outline btn-primary"
                onClick={() => void restart()}
                disabled={loadingParagraph}
              >
                New test
              </button>
            </div>
          </div>
        </div>
      </div>

      {phase === "done" && finalSummary && (
        <div className="card border-2 border-primary bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Summary</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>WPM: {finalSummary.wpm}</li>
              <li>Accuracy: {finalSummary.accuracy}%</li>
              <li>Characters typed: {finalSummary.charactersTyped}</li>
            </ul>
            {submitting && (
              <span className="text-base-content/70 text-sm">Saving…</span>
            )}
            {submitError && (
              <div role="alert" className="alert alert-warning">
                {submitError}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card bg-base-200 shadow-md">
        <div className="card-body gap-3">
          <h2 className="card-title text-lg">WPM over time</h2>
          <WpmHistoryChart pastResults={pastResults} />
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg">Previous results</h2>
          {resultsError && (
            <div role="alert" className="alert alert-warning">
              {resultsError}
            </div>
          )}
          {!resultsError && pastResults.length === 0 && (
            <p className="text-base-content/60 text-sm">No results yet.</p>
          )}
          {pastResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table-zebra table-sm table">
                <thead>
                  <tr>
                    <th>WPM</th>
                    <th>Accuracy</th>
                    <th>Chars</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {pastResults.map((r) => (
                    <tr key={r.id}>
                      <td className="tabular-nums">{r.wpm}</td>
                      <td className="tabular-nums">{r.accuracy}%</td>
                      <td className="tabular-nums">{r.charactersTyped}</td>
                      <td className="tabular-nums">{r.durationSeconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParagraphPreview({
  target,
  typed,
  phase,
}: {
  target: string;
  typed: string;
  phase: string;
}) {
  const chars = target.split("");
  return (
    <p
      className="max-w-full break-words rounded-box border border-base-300 bg-base-100 p-4 font-mono text-base leading-relaxed"
      aria-live="polite"
    >
      {chars.map((ch, i) => {
        let cls = "text-base-content/40";
        if (i < typed.length) {
          cls = typed[i] === ch ? "text-success" : "text-error bg-error/10";
        } else if (i === typed.length && phase === "running") {
          cls = "border-b-2 border-primary text-base-content";
        }
        return (
          <span key={i} className={cls}>
            {ch}
          </span>
        );
      })}
    </p>
  );
}

function TypingTextarea({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const syncRows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.rows = 1;
    const lineHeightPx = parseFloat(getComputedStyle(el).lineHeight);
    if (!Number.isFinite(lineHeightPx) || lineHeightPx <= 0) {
      el.rows = MIN_TYPING_TEXTAREA_ROWS;
      return;
    }
    const nextRows = Math.max(
      MIN_TYPING_TEXTAREA_ROWS,
      Math.ceil(el.scrollHeight / lineHeightPx)
    );
    el.rows = nextRows;
  }, []);

  useLayoutEffect(() => {
    syncRows();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      syncRows();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [value, syncRows]);

  return (
    <textarea
      ref={ref}
      data-testid="typing-textarea"
      rows={MIN_TYPING_TEXTAREA_ROWS}
      className="textarea-bordered textarea max-h-none w-full resize-none overflow-hidden font-mono text-base leading-normal"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Typing area"
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
    />
  );
}
