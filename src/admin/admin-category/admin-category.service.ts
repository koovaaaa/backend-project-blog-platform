import { Injectable } from '@nestjs/common';
import { AddCategoryDto } from './dto/add-category.dto';
import { User } from '../../entity/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entity/category/category.entity';
import { CategoryRepository } from '../../repository/category/category.repository';
import { ExceptionService } from '../../common/services/exception.service';
import { ThumbService } from '../../common/services/thumb.service';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { EditCategoryDto } from './dto/edit-category.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as fs from 'fs';
import { PathUploadEnum } from '../../enum/path-upload.enum';

@Injectable()
export class AdminCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly exceptionService: ExceptionService,
    private readonly thumbService: ThumbService,
  ) {}
  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async addNewCategory(
    categoryData: AddCategoryDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Category> {
    try {
      let category = new Category(categoryData);
      category.user = user;
      category.categoryPhoto =
        file.destination.replace(process.env.ROOT_UPLOAD_FOLDER, '') +
        '/' +
        file.filename;

      category = await this.categoryRepository.save(category);

      await this.thumbService.createThumb(
        file,
        parseInt(process.env.THUMB_WIDTH_1),
        parseInt(process.env.THUMB_HEIGHT_1),
      );

      await this.thumbService.createThumb(
        file,
        parseInt(process.env.THUMB_WIDTH_2),
        parseInt(process.env.THUMB_HEIGHT_2),
      );

      return category;
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async addNewCategories(
    categoriesData: AddCategoriesDto,
    files: Express.Multer.File[],
    user: User,
  ): Promise<void> {
    try {
      const categories = JSON.parse(categoriesData.categories.toString());
      for (const category of categories) {
        category.user = user;
        for (const file of files) {
          if (category.categoryPhoto === file.originalname) {
            category.categoryPhoto =
              file.destination.replace(process.env.ROOT_UPLOAD_FOLDER, '') +
              '/' +
              file.filename;
          }
        }
        await this.categoryRepository.save(category);
      }
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async editCategory(
    id: string,
    categoryData: EditCategoryDto,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    try {
      const category = new Category(categoryData);
      if (file)
        category.categoryPhoto =
          file.destination.replace(process.env.ROOT_UPLOAD_FOLDER, '') +
          '/' +
          file.filename;
      else category.categoryPhoto = null;
      await fs.rmdir(
        PathUploadEnum.CATEGORY_PHOTO + id,
        { recursive: true },
        () => {},
      );

      console.log(PathUploadEnum.CATEGORY_PHOTO + process.env.TEMP_FOLDER);
      console.log(PathUploadEnum.CATEGORY_PHOTO + id);

      await fs.rename(
        PathUploadEnum.CATEGORY_PHOTO + process.env.TEMP_FOLDER,
        PathUploadEnum.CATEGORY_PHOTO + id,
        (err) => {
          if (err) console.log(err);
        },
      );

      return await this.categoryRepository.update(id, category);
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    try {
      fs.rmdir(
        PathUploadEnum.CATEGORY_PHOTO + id,
        { recursive: true },
        () => {},
      );

      return await this.categoryRepository.delete(id);
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }
}
