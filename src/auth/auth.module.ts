import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthStrategy } from 'src/common/guards/AuthStrategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/guards/jwtStrategy';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  providers: [AuthService, AuthStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
