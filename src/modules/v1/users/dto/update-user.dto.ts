import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastName?: string;

  @IsString()
  @IsEmail({}, { message: 'Email is required.' })
  email?: string;
}
