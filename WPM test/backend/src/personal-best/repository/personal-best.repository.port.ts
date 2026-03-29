import { CreatePersonalBestDto } from '../dto/create-personal-best.dto';
import { UpdatePersonalBestDto } from '../dto/update-personal-best.dto';
import { PersonalBestModel } from '../model/personal-best.model';

export abstract class PersonalBestRepositoryPort {
  abstract recordAttempt(
    dto: CreatePersonalBestDto,
  ): { current: PersonalBestModel | null; improved: boolean };

  abstract findCurrent(): PersonalBestModel | null;

  abstract update(
    id: string,
    dto: UpdatePersonalBestDto,
  ): PersonalBestModel | null;
}
