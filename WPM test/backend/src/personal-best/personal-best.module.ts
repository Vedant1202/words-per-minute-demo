import { Module } from '@nestjs/common';
import { PersonalBestController } from './personal-best.controller';
import { PersonalBestService } from './personal-best.service';
import { PersonalBestRepository } from './repository/personal-best.repository';
import { PersonalBestRepositoryPort } from './repository/personal-best.repository.port';

@Module({
  controllers: [PersonalBestController],
  providers: [
    PersonalBestService,
    {
      provide: PersonalBestRepositoryPort,
      useClass: PersonalBestRepository,
    },
  ],
})
export class PersonalBestModule {}
