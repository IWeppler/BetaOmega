import {
    Entity,
    PrimaryColumn,
    Column,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Book } from '../../books/entities/book.entity';


  @Entity('user_book_progress')
  export class UserBookProgress {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  book_id: string;

  @Column({ type: 'int' })
  current_chapter: number;

  @Column({ type: 'int' })
  progress: number;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}