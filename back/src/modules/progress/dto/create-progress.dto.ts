import { IsUUID, IsInt } from 'class-validator';

export class CreateProgressDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  book_id: string;

  @IsInt()
  current_chapter: number;

  @IsInt()
  progress: number;
}
