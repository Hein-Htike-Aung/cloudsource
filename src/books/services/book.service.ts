import { ForbiddenException, Injectable } from '@nestjs/common';
import successResponse from 'src/common/successResponse';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateBookDto } from '../schemas/create_book.schema';
import { UpdateBookDto } from '../schemas/update_book.schema';
import { AuthorService } from './author.service';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    private authorService: AuthorService,
  ) {}

  async createBook(createBookDto: CreateBookDto, authorId: number) {
    try {
      const existingBook = await this.prisma.book.findFirst({
        where: {
          name: createBookDto.name,
        },
      });

      if (existingBook) throw new ForbiddenException('Book already exists');

      const newBook = await this.prisma.book.create({
        data: {
          ...createBookDto,
          authorId,
        },
      });

      return successResponse(newBook, 'created');
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateBook(
    updateBookDto: UpdateBookDto,
    id: number,
    currentUserId: number,
  ) {
    try {
      const existingBook = await this.prisma.book.findUnique({
        where: {
          id,
        },
      });

      if (!existingBook) throw new ForbiddenException('Book not found');

      if (existingBook.authorId !== currentUserId)
        throw new ForbiddenException('You can only update your own book');

      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deleteBook(id: number, currentUserId: number) {
    try {
      const existingBook = await this.prisma.book.findUnique({
        where: {
          id,
        },
      });

      if (!existingBook) throw new ForbiddenException('Book not found');

      if (existingBook.authorId !== currentUserId)
        throw new ForbiddenException('You can only delete your own book');

      return this.prisma.book.delete({ where: { id } });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findBookById(id: number) {
    try {
      const existingBook = await this.prisma.book.findUnique({
        where: {
          id,
        },
        include: {
          author: true,
        },
      });

      delete existingBook.author.password;

      if (!existingBook) throw new ForbiddenException('Book not found');
      return existingBook;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findAllBooks(page: number, size: number) {
    try {
      const books = await this.prisma.book.findMany({
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: Number(page) * Number(size),
        take: Number(size),
      });

      await Promise.all(
        books.map(async (b) => {
          delete b.author.password;
        }),
      );

      return successResponse(books);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findBooksForAuthor(authorId: number, page: number, size: number) {
    try {
      await this.authorService.findBookById(authorId);

      const books = await this.prisma.book.findMany({
        include: {
          author: true,
        },
        where: {
          authorId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: Number(page) * Number(size),
        take: Number(size),
      });

      await Promise.all(
        books.map(async (b) => {
          delete b.author.password;
        }),
      );

      return successResponse(books);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
