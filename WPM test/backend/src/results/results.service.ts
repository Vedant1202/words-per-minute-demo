import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';

export interface StoredResult extends CreateResultDto {
  id: string;
}

@Injectable()
export class ResultsService {
  private readonly results: StoredResult[] = [];

  create(dto: CreateResultDto): StoredResult {
    const row: StoredResult = { id: randomUUID(), ...dto };
    this.results.unshift(row);
    return row;
  }

  findAll(): StoredResult[] {
    return [...this.results];
  }
}
