import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthorSchema {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  ph_no: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
