import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBookProgress } from './entities/progress.entity';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Book } from 'src/modules/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBookProgress, Book])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
