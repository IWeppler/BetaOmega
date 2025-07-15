import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBookProgress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserBookProgress)
    private readonly progressRepository: Repository<UserBookProgress>,
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

    if (existing) {
      existing.current_chapter = dto.current_chapter;
      existing.progress = dto.progress;
      return this.progressRepository.save(existing);
    }

    const newProgress = this.progressRepository.create(dto);
    return this.progressRepository.save(newProgress);
  }
}
