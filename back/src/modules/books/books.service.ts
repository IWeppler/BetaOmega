import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { BookContent } from '../content/entities/content.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(BookContent)
    private readonly contentRepo: Repository<BookContent>,
  ) {}

  findAll() {
    return this.bookRepo.find();
  }

  async findBySlug(slug: string) {
    console.log(`Buscando libro con slug: "${slug}"`);

    // Paso 1: Buscar el libro principal, pero SIN cargar las relaciones.
    const book = await this.bookRepo.findOne({ where: { slug } });

    if (!book) {
      console.log(`Libro con slug "${slug}" no encontrado.`);
      throw new NotFoundException(`Libro con slug "${slug}" no encontrado.`);
    }
    
    console.log(`Libro encontrado: ${book.title}`);

    // Paso 2: Buscar los contenidos del libro en una consulta separada.
    const contents = await this.contentRepo.find({
      where: { book_id: book.id },
      order: { chapter_number: 'ASC' }, // Ordenamos los capítulos aquí.
    });
    
    console.log(`Encontrados ${contents.length} capítulos para el libro.`);

    // Paso 3: Combinar el libro y sus contenidos.
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

  create(dto: CreateBookDto) {
    const book = this.bookRepo.create(dto);
    return this.bookRepo.save(book);
  }

}
