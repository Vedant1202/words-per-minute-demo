import { Module } from '@nestjs/common';
import { ParagraphsModule } from './paragraphs/paragraphs.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [ParagraphsModule, ResultsModule],
})
export class AppModule {}
