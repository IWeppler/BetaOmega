import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Req,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ReorderBooksDto } from './dto/reorder-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary'

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('id/:id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.findOne(id);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.booksService.findBySlug(slug);
  }

  @Get(':slug/chapters/:chapterNumber')
  findChapter(
    @Param('slug') slug: string,
    @Param('chapterNumber') chapterNumber: string,
  ) {
    return this.booksService.findChapterBySlugAndNumber(slug, +chapterNumber);
  }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
          return {
            folder: 'book-covers',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `book-cover-${Date.now()}`,
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
  async uploadCover(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return {
      url: file.path, 
      public_id: (file as any).filename, 
    };
  }

  @Put('id/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBookDto,
  ) {
    console.log(`Petición PUT recibida para el libro con ID: ${id}`);
    return this.booksService.update(id, dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.remove(id);
  }

  @Patch('reorder')
  updateOrder(@Body() dto: ReorderBooksDto) {
    return this.booksService.reorder(dto);
  }
}
