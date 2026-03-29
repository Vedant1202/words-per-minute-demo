import { Module } from '@nestjs/common';
import { ParagraphsController } from './paragraphs.controller';
import { ParagraphsService } from './paragraphs.service';

@Module({
  controllers: [ParagraphsController],
  providers: [ParagraphsService],
})
export class ParagraphsModule {}
