import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Author } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { _AuthGuard } from 'src/common/guards/AuthGuard';
import { CreateAuthorSchema } from '../schema/createAuthor.schema';
import { AuthService } from '../services/auth.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/create_author')
  createAuthor(@Body() createAuthorSchema: CreateAuthorSchema) {
    return this.authService.createAuthor(createAuthorSchema);
  }

  @Public()
  @HttpCode(200)
  @Post('/author_sign_in')
  @UseGuards(_AuthGuard)
  authSignIn(@CurrentUser() author: Author) {
    return this.authService.signIn(author.id, author.email);
  }
}
