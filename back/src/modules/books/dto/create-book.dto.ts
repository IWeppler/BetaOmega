import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  cover_url: string;

  @IsNumber()
  total_chapters: number;
}
