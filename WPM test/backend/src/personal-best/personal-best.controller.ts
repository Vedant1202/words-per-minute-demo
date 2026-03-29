import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePersonalBestDto } from './dto/create-personal-best.dto';
import { UpdatePersonalBestDto } from './dto/update-personal-best.dto';
import { PERSONAL_BEST_CONTROLLER_PATH } from './personal-best.constants';
import { PersonalBestService } from './personal-best.service';

@Controller(PERSONAL_BEST_CONTROLLER_PATH)
export class PersonalBestController {
  constructor(private readonly personalBestService: PersonalBestService) {}

  @Post()
  submitAttempt(@Body() dto: CreatePersonalBestDto) {
    return this.personalBestService.submitAttempt(dto);
  }

  @Get()
  findCurrent() {
    return { personalBest: this.personalBestService.findCurrent() };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePersonalBestDto) {
    const updated = this.personalBestService.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Personal best not found');
    }
    return updated;
  }
}
