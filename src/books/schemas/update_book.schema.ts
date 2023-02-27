import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create_book.schema';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
