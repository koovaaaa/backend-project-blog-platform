import { Module } from '@nestjs/common';
import { AdminCategoryController } from './admin-category.controller';
import { AdminCategoryService } from './admin-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entity/category/category.entity';
import { ExceptionService } from '../../common/services/exception.service';
import { ThumbService } from '../../common/services/thumb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [AdminCategoryController],
  providers: [AdminCategoryService, ExceptionService, ThumbService],
})
export class AdminCategoryModule {}
