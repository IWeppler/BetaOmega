import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateBookContentDto } from './dto/create-book-content.dto';
import { UpdateBookContentDto } from './dto/update-book-content.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/book-content',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      url: `/public/book-content/${file.filename}`,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}