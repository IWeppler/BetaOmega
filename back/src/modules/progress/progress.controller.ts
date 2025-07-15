import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  findAll() {
    return this.progressService.findAll();
  }

  @Get('user/:user_id')
  findByUser(@Param('user_id') user_id: string) {
    return this.progressService.findByUser(user_id);
  }

  @Post()
  upsert(@Body() dto: CreateProgressDto) {
    return this.progressService.upsert(dto);
  }
}
