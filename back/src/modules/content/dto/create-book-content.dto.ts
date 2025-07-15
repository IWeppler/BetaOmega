import { IsUUID, IsInt, IsString } from 'class-validator';

export class CreateBookContentDto {
  @IsUUID()
  book_id: string;

  @IsInt()
  chapter_number: number;

  @IsString()
  title: string;

  @IsString()
  md_content: string;
}
