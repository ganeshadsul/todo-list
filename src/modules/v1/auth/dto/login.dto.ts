import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
