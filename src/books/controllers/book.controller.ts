import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQuery } from 'src/common/paginationQuery';
import { UpdateBookDto } from '../schemas/update_book.schema';
import { BookService } from '../services/book.service';
import { CreateBookDto } from './../schemas/create_book.schema';

@Controller('/api/v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @HttpCode(200)
  @Post('/create_book')
  createBook(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() author: Author,
  ) {
    return this.bookService.createBook(createBookDto, author.id);
  }

  @HttpCode(200)
  @Patch('/update_book/:bookId')
  updateBook(
    @Param('bookId') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() author: Author,
  ) {
    return this.bookService.updateBook(updateBookDto, Number(id), author.id);
  }

  @HttpCode(200)
  @Delete('/delete/:bookId')
  deleteBook(@Param('bookId') id: string, @CurrentUser() author: Author) {
    return this.bookService.deleteBook(Number(id), author.id);
  }

  @Public()
  @HttpCode(200)
  @Get('/find_by_Id/:bookId')
  findBookById(@Param('bookId') id: string) {
    return this.bookService.findBookById(Number(id));
  }

  @Public()
  @HttpCode(200)
  @Get('/find_all_books')
  findAllBooks(@Query() paginationQuery: PaginationQuery) {
    return this.bookService.findAllBooks(
      paginationQuery.page,
      paginationQuery.size,
    );
  }

  @Public()
  @HttpCode(200)
  @Get('/find_all_books_for_author/:authorId')
  findAllBooksForAuthor(
    @Param('authorId') authorId,
    @Query() paginationQuery: PaginationQuery,
  ) {
    return this.bookService.findBooksForAuthor(
      Number(authorId),
      paginationQuery.page,
      paginationQuery.size,
    );
  }
}
