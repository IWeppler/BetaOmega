import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateBookContentDto } from './dto/create-book-content.dto';

@Controller('book-content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get('book/:book_id')
  findByBookId(@Param('book_id') book_id: string) {
    return this.contentService.findByBookId(book_id);
  }

  @Post()
  create(@Body() dto: CreateBookContentDto) {
    return this.contentService.create(dto);
  }
}