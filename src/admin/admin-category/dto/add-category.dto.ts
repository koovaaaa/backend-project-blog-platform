import { Category } from '../../../entity/category/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({ required: false })
  @IsOptional()
  parent: Category;
  @ApiProperty({ type: 'string', format: 'binary' })
  categoryPhoto: any;
}
