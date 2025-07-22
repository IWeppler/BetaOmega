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
    const book = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });

    if (!book) {
      throw new NotFoundException(`Libro con ID "${dto.book_id}" no encontrado.`);
    }

    const existingProgress = await this.progressRepository.findOne({
      where: { user_id: dto.user_id, book_id: dto.book_id },
    });

    const progressPercentage = Math.min(
      100,
      Math.round((dto.current_chapter / book.total_chapters) * 100),
    );

    if (existingProgress) {
      // Opcional: Evitar que el usuario guarde un capítulo anterior al actual.
      if (dto.current_chapter < existingProgress.current_chapter) {
        console.log(`Intento de retroceder progreso para el libro ${dto.book_id}. No se guardará.`);
        return existingProgress; // Devolvemos el progreso sin cambios.
      }
      
      // Actualizamos los datos del progreso existente.
      existingProgress.current_chapter = dto.current_chapter;
      existingProgress.progress = progressPercentage;
      return this.progressRepository.save(existingProgress);
    }

    const newProgress = this.progressRepository.create({
      user_id: dto.user_id,
      book_id: dto.book_id,
      current_chapter: dto.current_chapter,
      progress: progressPercentage,
    });
    return this.progressRepository.save(newProgress);
  }
}
