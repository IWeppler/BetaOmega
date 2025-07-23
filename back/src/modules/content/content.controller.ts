import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateBookContentDto } from './dto/create-book-content.dto';
import { UpdateBookContentDto } from './dto/update-book-content.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary'

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
    storage: new CloudinaryStorage({
            cloudinary: cloudinary,
            params: async (req, file) => {
              return {
                folder: 'book-content',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                public_id: `book-content-${Date.now()}`,
              };
            },
          }),
          fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
              cb(new Error('Solo se permiten imágenes'), false);
            } else {
              cb(null, true);
            }
          },
        }),
      )
  
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: file.path, 
      public_id: (file as any).filename, 
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