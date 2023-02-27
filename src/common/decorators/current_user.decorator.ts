import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Author } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const author: Author = ctx.switchToHttp().getRequest().user;

    if (!author) {
      throw new UnauthorizedException('There is no logged in user');
    }

    if (data) {
      return author[data];
    }

    return author;
  },
);
