import type {
  CreateResultPayload,
  ParagraphResponse,
  StoredResult,
} from "../types/api";

const baseUrl =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:3000";

export async function fetchRandomParagraph(): Promise<ParagraphResponse> {
  const res = await fetch(`${baseUrl}/paragraphs/random`);
  if (!res.ok) throw new Error(`Could not load paragraph (${res.status})`);
  return res.json() as Promise<ParagraphResponse>;
}

export async function fetchResults(): Promise<{ results: StoredResult[] }> {
  const res = await fetch(`${baseUrl}/results`);
  if (!res.ok) throw new Error(`Could not load results (${res.status})`);
  return res.json() as Promise<{ results: StoredResult[] }>;
}

export async function submitResult(
  payload: CreateResultPayload
): Promise<StoredResult> {
  const res = await fetch(`${baseUrl}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Could not save result (${res.status})`);
  return res.json() as Promise<StoredResult>;
}
