import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateProgressDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  book_id: string;

  @IsInt()
  @Min(1)
  current_chapter: number;
}
