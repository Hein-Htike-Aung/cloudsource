import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSchema {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
