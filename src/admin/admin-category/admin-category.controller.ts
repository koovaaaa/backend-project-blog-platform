import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminCategoryService } from './admin-category.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AddCategoryDto } from './dto/add-category.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import setMulterConfig from '../../config/multerconfig';
import { PathUploadEnum } from '../../enum/path-upload.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../entity/user/user.entity';
import { Category } from '../../entity/category/category.entity';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { EditCategoryDto } from './dto/edit-category.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CategoryInterceptor } from '../../interceptor/category.interceptor';

@ApiTags('Admin Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin-category')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Get('get-categories')
  async getAllCategories(): Promise<Category[]> {
    return await this.adminCategoryService.getCategories();
  }

  @Post('add-new-category')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddCategoryDto })
  @UseInterceptors(
    FileInterceptor(
      'categoryPhoto',
      setMulterConfig(PathUploadEnum.CATEGORY_PHOTO, false),
    ),
    CategoryInterceptor,
  )
  async addNewCategory(
    @Body() categoryData: AddCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<Category> {
    return await this.adminCategoryService.addNewCategory(
      categoryData,
      file,
      user,
    );
  }

  @Post('add-new-categories')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddCategoriesDto })
  @UseInterceptors(
    FilesInterceptor(
      'photos',
      10,
      setMulterConfig(PathUploadEnum.CATEGORY_PHOTO, false),
    ),
  )
  async addNewCategories(
    @Body() categoriesData: AddCategoriesDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ): Promise<void> {
    return await this.adminCategoryService.addNewCategories(
      categoriesData,
      files,
      user,
    );
  }

  @Put('edit-category/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: EditCategoryDto })
  @UseInterceptors(
    FileInterceptor(
      'categoryPhoto',
      setMulterConfig(PathUploadEnum.CATEGORY_PHOTO, false),
    ),
  )
  async editCategory(
    @Param('id') categoryId: string,
    @Body() categoryData: EditCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateResult> {
    return await this.adminCategoryService.editCategory(
      categoryId,
      categoryData,
      file,
    );
  }

  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') categoryId: string): Promise<DeleteResult> {
    return await this.adminCategoryService.deleteCategory(categoryId);
  }
}
