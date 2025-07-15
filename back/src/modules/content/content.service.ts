import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookContent } from './entities/content.entity';
import { CreateBookContentDto } from './dto/create-book-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(BookContent)
    private readonly contentRepository: Repository<BookContent>,
  ) {}

  findAll() {
    return this.contentRepository.find();
  }

  create(dto: CreateBookContentDto) {
    const content = this.contentRepository.create(dto);
    return this.contentRepository.save(content);
  }

  findByBookId(book_id: string) {
    return this.contentRepository.find({ where: { book_id } });
  }
}
