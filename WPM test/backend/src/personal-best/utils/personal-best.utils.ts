import { PersonalBestModel } from '../model/personal-best.model';

export function isBetterPersonalBest(
  wpm: number,
  accuracy: number,
  current: PersonalBestModel | null,
): boolean {
  if (!current) {
    return true;
  }
  if (wpm > current.wpm) {
    return true;
  }
  if (wpm === current.wpm && accuracy > current.accuracy) {
    return true;
  }
  return false;
}
