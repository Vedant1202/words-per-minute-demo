import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchPersonalBest,
  fetchRandomParagraph,
  fetchResults,
  submitPersonalBest,
  submitResult,
} from "../api/client";
import type { ParagraphResponse, StoredResult } from "../types/api";

/** Test length in seconds. */
export const DURATION_SEC = 60;

/** WPM = (correctChars / 5) / elapsedMinutes — standard “word” = 5 characters. */
export function countCorrectChars(typed: string, target: string): number {
  let n = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) n++;
  }
  return n;
}

export type TypingPhase = "waiting" | "running" | "done";

export function useTypingTest() {
  const [paragraph, setParagraph] = useState<ParagraphResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingParagraph, setLoadingParagraph] = useState(true);

  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [phase, setPhase] = useState<TypingPhase>("waiting");

  const [pastResults, setPastResults] = useState<StoredResult[]>([]);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [personalBestResultId, setPersonalBestResultId] = useState<
    string | null
  >(null);

  const [finalSummary, setFinalSummary] = useState<{
    wpm: number;
    accuracy: number;
    charactersTyped: number;
  } | null>(null);

  const inputRef = useRef(input);
  inputRef.current = input;

  const finishOnceRef = useRef(false);

  const loadParagraph = useCallback(async () => {
    setLoadingParagraph(true);
    setLoadError(null);
    try {
      const p = await fetchRandomParagraph();
      setParagraph(p);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load paragraph");
      setParagraph(null);
    } finally {
      setLoadingParagraph(false);
    }
  }, []);

  const loadResults = useCallback(async () => {
    setResultsError(null);
    try {
      const { results } = await fetchResults();
      setPastResults(results);
    } catch {
      setResultsError("Could not load previous results");
    }
  }, []);

  const loadPersonalBest = useCallback(async () => {
    try {
      const { personalBest } = await fetchPersonalBest();
      setPersonalBestResultId(personalBest?.resultId ?? null);
    } catch {
      // Keep results UX resilient: this endpoint is supplemental for highlighting.
      setPersonalBestResultId(null);
    }
  }, []);

  useEffect(() => {
    void loadParagraph();
    void loadResults();
    void loadPersonalBest();
  }, [loadParagraph, loadResults, loadPersonalBest]);

  const targetText = paragraph?.text ?? "";

  const elapsedSec =
    startedAt != null ? Math.max(0, (nowTick - startedAt) / 1000) : 0;
  const timeRemaining =
    startedAt != null ? Math.max(0, DURATION_SEC - elapsedSec) : DURATION_SEC;

  const totalTyped = input.length;
  const correctChars = targetText ? countCorrectChars(input, targetText) : 0;
  const accuracy =
    totalTyped === 0
      ? 100
      : Math.round((correctChars / totalTyped) * 1000) / 10;

  const elapsedMin = elapsedSec / 60;
  const wpm =
    startedAt != null && elapsedMin > 0
      ? Math.round((correctChars / 5 / elapsedMin) * 10) / 10
      : 0;

  useEffect(() => {
    if (phase !== "running" || startedAt == null) return;
    finishOnceRef.current = false;
    const id = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startedAt) / 1000;
      setNowTick(now);
      if (elapsed >= DURATION_SEC && !finishOnceRef.current) {
        finishOnceRef.current = true;
        const typed = inputRef.current;
        const target = paragraph?.text ?? "";
        const cc = countCorrectChars(typed, target);
        const tt = typed.length;
        const eMin = elapsed / 60;
        const fw = eMin > 0 ? Math.round((cc / 5 / eMin) * 10) / 10 : 0;
        const fa = tt === 0 ? 100 : Math.round((cc / tt) * 1000) / 10;
        setFinalSummary({
          wpm: fw,
          accuracy: fa,
          charactersTyped: tt,
        });
        setPhase("done");
        setSubmitting(true);
        setSubmitError(null);
        void submitResult({
          wpm: fw,
          accuracy: fa,
          charactersTyped: tt,
          durationSeconds: DURATION_SEC,
          completedAt: new Date().toISOString(),
        })
          .then((savedResult) =>
            submitPersonalBest({
              resultId: savedResult.id,
              wpm: savedResult.wpm,
              accuracy: savedResult.accuracy,
              charactersTyped: savedResult.charactersTyped,
              durationSeconds: savedResult.durationSeconds,
              completedAt: savedResult.completedAt,
            }).then((pb) => {
              setPersonalBestResultId(pb.current?.resultId ?? null);
            })
          )
          .then(() => loadResults())
          .catch(() => setSubmitError("Failed to save result"))
          .finally(() => setSubmitting(false));
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, startedAt, paragraph?.text, loadResults]);

  const onInputChange = useCallback(
    (value: string) => {
      if (phase === "done" || loadingParagraph || !paragraph) return;
      if (phase === "waiting" && value.length > 0) {
        setStartedAt(Date.now());
        setPhase("running");
      }
      setInput(value);
    },
    [phase, loadingParagraph, paragraph]
  );

  const restart = useCallback(async () => {
    setInput("");
    setStartedAt(null);
    setPhase("waiting");
    setFinalSummary(null);
    setSubmitError(null);
    finishOnceRef.current = false;
    setNowTick(Date.now());
    await loadParagraph();
  }, [loadParagraph]);

  return {
    paragraph,
    loadingParagraph,
    loadError,
    input,
    onInputChange,
    phase,
    timeRemaining,
    wpm,
    accuracy,
    charactersTyped: totalTyped,
    correctChars,
    finalSummary,
    submitting,
    submitError,
    pastResults,
    resultsError,
    personalBestResultId,
    restart,
    reloadResults: loadResults,
  };
}
