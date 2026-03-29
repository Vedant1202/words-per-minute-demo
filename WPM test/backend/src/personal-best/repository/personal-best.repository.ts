import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreatePersonalBestDto } from '../dto/create-personal-best.dto';
import { UpdatePersonalBestDto } from '../dto/update-personal-best.dto';
import { PersonalBestModel } from '../model/personal-best.model';
import { isBetterPersonalBest } from '../utils/personal-best.utils';
import { PersonalBestRepositoryPort } from './personal-best.repository.port';

@Injectable()
export class PersonalBestRepository extends PersonalBestRepositoryPort {
  private best: PersonalBestModel | null = null;

  recordAttempt(
    dto: CreatePersonalBestDto,
  ): { current: PersonalBestModel | null; improved: boolean } {
    if (!isBetterPersonalBest(dto.wpm, dto.accuracy, this.best)) {
      return { current: this.best, improved: false };
    }
    this.best = {
      id: randomUUID(),
      wpm: dto.wpm,
      accuracy: dto.accuracy,
      charactersTyped: dto.charactersTyped,
      durationSeconds: dto.durationSeconds,
      completedAt: dto.completedAt ?? new Date().toISOString(),
    };
    return { current: this.best, improved: true };
  }

  findCurrent(): PersonalBestModel | null {
    return this.best;
  }

  update(id: string, dto: UpdatePersonalBestDto): PersonalBestModel | null {
    if (!this.best || this.best.id !== id) {
      return null;
    }
    this.best = {
      ...this.best,
      ...dto,
      id: this.best.id,
    };
    return this.best;
  }
}
