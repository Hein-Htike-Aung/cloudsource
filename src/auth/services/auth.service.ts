import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateAuthorSchema } from '../schema/createAuthor.schema';
import * as argon from 'argon2';
import successResponse from 'src/common/successResponse';
import { AuthSchema } from '../schema/auth.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async createAuthor(authorDto: CreateAuthorSchema) {
    try {
      const existingAuthor = await this.prisma.author.findFirst({
        where: {
          OR: [{ email: authorDto.email }, { name: authorDto.name }],
        },
      });

      if (existingAuthor) throw new ForbiddenException('Author already exists');

      const hashPassword = await argon.hash(authorDto.password);

      const newAuthor = await this.prisma.author.create({
        data: {
          ...authorDto,
          password: hashPassword,
        },
      });

      delete newAuthor.password;
      return successResponse(newAuthor, 'created');
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async checkCredentialForAuthor(authDto: AuthSchema) {
    const existingAuthor = await this.prisma.author.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!existingAuthor) return false;

    const pwdMatch = await argon.verify(
      existingAuthor.password,
      authDto.password,
    );

    if (!pwdMatch) {
      return false;
    }

    return existingAuthor;
  }

  async signIn(id: number, email: string) {
    const token = this.generateToken(id, email);

    return token;
  }

  async generateToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('JWT_TOKEN_EXPIRATION_TIME'),
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token,
    };
  }
}
