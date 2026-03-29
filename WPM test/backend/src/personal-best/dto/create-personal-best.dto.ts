import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePersonalBestDto {
  @IsNumber()
  @Min(0)
  wpm: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @IsNumber()
  @Min(0)
  charactersTyped: number;

  @IsNumber()
  @Min(0)
  durationSeconds: number;

  @IsOptional()
  @IsString()
  completedAt?: string;
}
