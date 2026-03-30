import { Module } from '@nestjs/common';
import { ParagraphsModule } from './paragraphs/paragraphs.module';
import { PersonalBestModule } from './personal-best/personal-best.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [ParagraphsModule, PersonalBestModule, ResultsModule],
})
export class AppModule {}

