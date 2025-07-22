import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookContent } from './entities/content.entity';
import { CreateBookContentDto } from './dto/create-book-content.dto';
import { UpdateBookContentDto } from './dto/update-book-content.dto';


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

  async update(id: string, dto: UpdateBookContentDto) {
    const content = await this.contentRepository.preload({
      id: id,
      ...dto,
    });
    if (!content) {
      throw new NotFoundException(`Contenido con ID "${id}" no encontrado.`);
    }
    return this.contentRepository.save(content);
  }
  
  async remove(id: string) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Contenido con ID "${id}" no encontrado.`);
    }
    await this.contentRepository.remove(content);
  }
}
