import { IsString, IsNotEmpty, IsNumber, IsUrl, Matches } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'El slug no puede estar vacío' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
    message: 'El slug solo puede contener letras minúsculas, números y guiones' 
  })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty({ message: 'La URL de la portada no puede estar vacía' })
  cover_url: string;

  @IsNumber()
  total_chapters: number;
}