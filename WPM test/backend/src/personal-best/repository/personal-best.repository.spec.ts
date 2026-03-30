import { CreatePersonalBestDto } from '../dto/create-personal-best.dto';
import { PersonalBestRepository } from './personal-best.repository';

describe('PersonalBestRepository', () => {
  let repository: PersonalBestRepository;

  const makeDto = (overrides: Partial<CreatePersonalBestDto> = {}) =>
    ({
      resultId: '11111111-1111-4111-8111-111111111111',
      wpm: 40,
      accuracy: 96.5,
      charactersTyped: 200,
      durationSeconds: 60,
      completedAt: '2026-03-30T10:00:00.000Z',
      ...overrides,
    }) as CreatePersonalBestDto;

  beforeEach(() => {
    repository = new PersonalBestRepository();
  });

  it('stores first attempt as personal best', () => {
    const first = repository.recordAttempt(makeDto());
    expect(first.improved).toBe(true);
    expect(first.current?.resultId).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('does not replace personal best when attempt is worse', () => {
    repository.recordAttempt(makeDto({ wpm: 55, accuracy: 98 }));
    const second = repository.recordAttempt(
      makeDto({
        resultId: '22222222-2222-4222-8222-222222222222',
        wpm: 50,
        accuracy: 99.9,
      }),
    );
    expect(second.improved).toBe(false);
    expect(second.current?.wpm).toBe(55);
    expect(second.current?.resultId).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('replaces personal best when WPM is better', () => {
    repository.recordAttempt(makeDto({ wpm: 55, accuracy: 98 }));
    const improved = repository.recordAttempt(
      makeDto({
        resultId: '22222222-2222-4222-8222-222222222222',
        wpm: 56,
        accuracy: 95,
      }),
    );
    expect(improved.improved).toBe(true);
    expect(improved.current?.wpm).toBe(56);
    expect(improved.current?.resultId).toBe('22222222-2222-4222-8222-222222222222');
  });
});
