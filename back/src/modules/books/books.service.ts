import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { BookContent } from '../content/entities/content.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { ReorderBooksDto } from './dto/reorder-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(BookContent)
    private readonly contentRepo: Repository<BookContent>,
  ) {}

  findAll() {
    return this.bookRepo.find({
      order: {
        order: 'ASC',
      },
    });
  }

  async findBySlug(slug: string) {
    console.log(`Buscando libro con slug: "${slug}"`);

    const book = await this.bookRepo.findOne({ where: { slug } });

    if (!book) {
      console.log(`Libro con slug "${slug}" no encontrado.`);
      throw new NotFoundException(`Libro con slug "${slug}" no encontrado.`);
    }
    
    console.log(`Libro encontrado: ${book.title}`);

    const contents = await this.contentRepo.find({
      where: { book_id: book.id },
      order: { chapter_number: 'ASC' },
    });
    
    console.log(`Encontrados ${contents.length} capítulos para el libro.`);

    book.contents = contents;

    return book;
  }

  async findChapterBySlugAndNumber(slug: string, chapterNumber: number) {
    const book = await this.bookRepo.findOne({
      where: { slug },
      select: ['id'],
    });

    if (!book) {
      throw new NotFoundException(`Libro con slug "${slug}" no encontrado.`);
    }

    const chapter = await this.contentRepo.findOne({
      where: {
        book_id: book.id,
        chapter_number: chapterNumber,
      },
    });

    if (!chapter) {
      throw new NotFoundException(
        `Capítulo número ${chapterNumber} no encontrado para el libro "${slug}".`,
      );
    }

    return chapter;
  }

  findOne(id: string) {
    return this.bookRepo.findOne({ where: { id }, relations: ['contents'] });
  }

  async create(dto: CreateBookDto) {
    const lastBook = await this.bookRepo.findOne({
      order: { order: 'DESC' },
    });
  
    const newOrder = lastBook ? lastBook.order + 1 : 1;


    const book = this.bookRepo.create(dto);
    return this.bookRepo.save(book);
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    await this.bookRepo.update(id, dto);

    const updatedBook = await this.bookRepo.findOne({
      where: { id },
      relations: ['contents'],
    });
  
    if (!updatedBook) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado.`);
    }
  
    return updatedBook;
  }
  
  async remove(id: string) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
    }
    await this.bookRepo.remove(book);
  }

  async reorder(dto: ReorderBooksDto) {
    const book1 = await this.bookRepo.findOneBy({ id: dto.bookId1 });
    const book2 = await this.bookRepo.findOneBy({ id: dto.bookId2 });
  
    if (!book1 || !book2) {
      throw new NotFoundException('Uno o ambos libros no fueron encontrados.');
    }
  
    const tempOrder = book1.order;
    book1.order = book2.order;
    book2.order = tempOrder;
  
    await this.bookRepo.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(book1);
      await transactionalEntityManager.save(book2);
    });
  
    return { success: true };
  }
}
