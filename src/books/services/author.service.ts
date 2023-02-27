import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async findBookById(id: number) {
    try {
      const existingAuthor = await this.prisma.author.findUnique({
        where: {
          id,
        },
        include: {
          books: true,
        },
      });

      delete existingAuthor.password;

      if (!existingAuthor) throw new ForbiddenException('Author not found');
      return existingAuthor;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
