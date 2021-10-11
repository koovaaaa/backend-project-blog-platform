import { ApiProperty } from '@nestjs/swagger';
import { AddCategoryDto } from './add-category.dto';
import { IsOptional } from 'class-validator';

export class AddCategoriesDto {
  @ApiProperty()
  @IsOptional()
  categories: AddCategoryDto;
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  photos: any[];
}
