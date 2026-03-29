import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() dto: CreateResultDto) {
    return this.resultsService.create(dto);
  }

  @Get()
  findAll() {
    return { results: this.resultsService.findAll() };
  }
}
