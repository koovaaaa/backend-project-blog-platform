import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Category } from '../../../entity/category/category.entity';

export class EditCategoryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;
  @ApiProperty({ required: false })
  @IsOptional()
  parent: Category;
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  categoryPhoto: any;
}
