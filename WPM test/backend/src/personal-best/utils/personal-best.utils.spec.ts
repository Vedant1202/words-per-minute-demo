import { PersonalBestModel } from '../model/personal-best.model';
import { isBetterPersonalBest } from './personal-best.utils';

describe('isBetterPersonalBest', () => {
  const current: PersonalBestModel = {
    id: 'pb-1',
    resultId: '11111111-1111-4111-8111-111111111111',
    wpm: 50,
    accuracy: 98.2,
    charactersTyped: 220,
    durationSeconds: 60,
    completedAt: '2026-03-30T10:00:00.000Z',
  };

  it('returns true when no current personal best exists', () => {
    expect(isBetterPersonalBest(20, 90, null)).toBe(true);
  });

  it('returns true when WPM is higher', () => {
    expect(isBetterPersonalBest(51, 70, current)).toBe(true);
  });

  it('returns true when WPM ties and accuracy is higher', () => {
    expect(isBetterPersonalBest(50, 99.1, current)).toBe(true);
  });

  it('returns false when WPM ties and accuracy is lower/equal', () => {
    expect(isBetterPersonalBest(50, 98.2, current)).toBe(false);
    expect(isBetterPersonalBest(50, 97.9, current)).toBe(false);
  });

  it('returns false when WPM is lower', () => {
    expect(isBetterPersonalBest(49.9, 100, current)).toBe(false);
  });
});
