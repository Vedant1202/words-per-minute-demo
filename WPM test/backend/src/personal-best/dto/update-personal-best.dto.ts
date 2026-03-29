import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePersonalBestDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  wpm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  charactersTyped?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsString()
  completedAt?: string;
}
