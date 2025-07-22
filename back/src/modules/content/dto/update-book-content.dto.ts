import { PartialType } from '@nestjs/mapped-types';
import { CreateBookContentDto } from './create-book-content.dto';

export class UpdateBookContentDto extends PartialType(CreateBookContentDto) {}