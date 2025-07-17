import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookContent } from '../../content/entities/content.entity';
import { UserBookProgress } from '../../progress/entities/progress.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  cover_url: string;

  @Column({ type: 'int' })
  total_chapters: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @OneToMany(() => BookContent, (content) => content.book)
  contents: BookContent[];

  @OneToMany(() => UserBookProgress, (progress) => progress.book)
  progress: UserBookProgress[];
}
