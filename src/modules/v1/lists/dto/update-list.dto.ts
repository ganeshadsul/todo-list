import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsString()
  @MinLength(3)
  title?: string;

  @IsString()
  @MinLength(100)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;

  @IsNumber()
  @IsOptional()
  isCompleted?: number;
}
