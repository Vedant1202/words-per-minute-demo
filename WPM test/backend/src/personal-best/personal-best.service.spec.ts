import { CreatePersonalBestDto } from './dto/create-personal-best.dto';
import { PersonalBestModel } from './model/personal-best.model';
import { PersonalBestService } from './personal-best.service';
import { PersonalBestRepositoryPort } from './repository/personal-best.repository.port';

describe('PersonalBestService', () => {
  const current: PersonalBestModel = {
    id: 'pb-1',
    resultId: '11111111-1111-4111-8111-111111111111',
    wpm: 50,
    accuracy: 98,
    charactersTyped: 220,
    durationSeconds: 60,
    completedAt: '2026-03-30T10:00:00.000Z',
  };

  const repository: jest.Mocked<PersonalBestRepositoryPort> = {
    recordAttempt: jest.fn(),
    findCurrent: jest.fn(),
    update: jest.fn(),
  };

  const service = new PersonalBestService(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates submitAttempt to repository', () => {
    const dto: CreatePersonalBestDto = {
      resultId: '11111111-1111-4111-8111-111111111111',
      wpm: 45,
      accuracy: 97,
      charactersTyped: 210,
      durationSeconds: 60,
      completedAt: '2026-03-30T10:00:00.000Z',
    };
    repository.recordAttempt.mockReturnValue({ current, improved: true });

    const result = service.submitAttempt(dto);

    expect(repository.recordAttempt).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ current, improved: true });
  });

  it('delegates findCurrent to repository', () => {
    repository.findCurrent.mockReturnValue(current);
    expect(service.findCurrent()).toEqual(current);
    expect(repository.findCurrent).toHaveBeenCalledTimes(1);
  });
});
