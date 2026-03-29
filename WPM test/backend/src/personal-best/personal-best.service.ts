import { Injectable } from '@nestjs/common';
import { CreatePersonalBestDto } from './dto/create-personal-best.dto';
import { UpdatePersonalBestDto } from './dto/update-personal-best.dto';
import { PersonalBestModel } from './model/personal-best.model';
import { PersonalBestRepositoryPort } from './repository/personal-best.repository.port';

@Injectable()
export class PersonalBestService {
  constructor(private readonly repository: PersonalBestRepositoryPort) {}

  submitAttempt(dto: CreatePersonalBestDto): {
    current: PersonalBestModel | null;
    improved: boolean;
  } {
    return this.repository.recordAttempt(dto);
  }

  findCurrent(): PersonalBestModel | null {
    return this.repository.findCurrent();
  }

  update(
    id: string,
    dto: UpdatePersonalBestDto,
  ): PersonalBestModel | null {
    return this.repository.update(id, dto);
  }
}
