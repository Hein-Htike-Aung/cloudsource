import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { AuthorService } from './services/author.service';
import { BookController } from './controllers/book.controller';
import { AuthorController } from './controllers/author.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BookService, AuthorService],
  controllers: [BookController, AuthorController],
})
export class BooksModule {}
