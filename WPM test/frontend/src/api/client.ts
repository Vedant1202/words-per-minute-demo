import type {
  CreatePersonalBestPayload,
  CreateResultPayload,
  ParagraphResponse,
  PersonalBest,
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

export async function fetchPersonalBest(): Promise<{
  personalBest: PersonalBest | null;
}> {
  const res = await fetch(`${baseUrl}/personal-best`);
  if (!res.ok) throw new Error(`Could not load personal best (${res.status})`);
  return res.json() as Promise<{ personalBest: PersonalBest | null }>;
}

export async function submitPersonalBest(
  payload: CreatePersonalBestPayload
): Promise<{ current: PersonalBest | null; improved: boolean }> {
  const res = await fetch(`${baseUrl}/personal-best`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Could not save personal best (${res.status})`);
  return res.json() as Promise<{
    current: PersonalBest | null;
    improved: boolean;
  }>;
}
