import { Controller, Get } from '@nestjs/common';
import { ParagraphsService } from './paragraphs.service';

@Controller('paragraphs')
export class ParagraphsController {
  constructor(private readonly paragraphsService: ParagraphsService) {}

  @Get('random')
  getRandom() {
    return this.paragraphsService.getRandom();
  }
}
