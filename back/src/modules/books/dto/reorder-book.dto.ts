import { IsUUID } from 'class-validator';

export class ReorderBooksDto {
  @IsUUID()
  bookId1: string;

  @IsUUID()
  bookId2: string;
}