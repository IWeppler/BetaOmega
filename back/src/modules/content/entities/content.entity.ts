import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Book } from '../../books/entities/book.entity';

  @Entity('book_content')
export class BookContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  book_id: string;

  @Column({ type: 'int' })
  chapter_number: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column('text')
  md_content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => Book, (book) => book.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
