import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  description: string;
}
