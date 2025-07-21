import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBookProgress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { Book } from 'src/modules/books/entities/book.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserBookProgress)
    private readonly progressRepository: Repository<UserBookProgress>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  findAll() {
    return this.progressRepository.find();
  }

  findByUser(user_id: string) {
    return this.progressRepository.find({ where: { user_id } });
  }

  async upsert(dto: CreateProgressDto) {
    const existing = await this.progressRepository.findOne({
      where: { user_id: dto.user_id, book_id: dto.book_id },
    });

    if (!existing) {
      throw new NotFoundException(`Libro con ID "${dto.book_id}" no encontrado.`);
    }

   if (existing && dto.current_chapter <= existing.current_chapter) {
      console.log(`Intento de retroceder progreso para el libro ${dto.book_id}. No se guardará.`);
      return existing;
    }

    const book = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });
    if (!book) {
      throw new NotFoundException(`Libro con ID "${dto.book_id}" no encontrado.`);
    }

    const progressPercentage = Math.min(
      100,
      Math.round((dto.current_chapter / book.total_chapters) * 100),
    );

    if (existing) {
      existing.current_chapter = dto.current_chapter;
      existing.progress = progressPercentage;
      return this.progressRepository.save(existing);
    }

    const newProgress = this.progressRepository.create({
      ...dto,
      progress: progressPercentage,
    });
    return this.progressRepository.save(newProgress);
  }
}
