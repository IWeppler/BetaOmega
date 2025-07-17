import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { BookContent } from 'src/modules/content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookContent])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})

export class BooksModule {}