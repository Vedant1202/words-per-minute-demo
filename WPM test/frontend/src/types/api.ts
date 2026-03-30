export interface ParagraphResponse {
  id: string;
  text: string;
}

export interface StoredResult {
  id: string;
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  durationSeconds: number;
  completedAt?: string;
}

export interface PersonalBest {
  id: string;
  resultId: string;
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  durationSeconds: number;
  completedAt: string;
}

export interface CreateResultPayload {
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  durationSeconds: number;
  completedAt?: string;
}

export interface CreatePersonalBestPayload {
  resultId: string;
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  durationSeconds: number;
  completedAt?: string;
}
