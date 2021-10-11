import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';
import { PathUploadEnum } from '../enum/path-upload.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category/category.entity';
import { CategoryRepository } from '../repository/category/category.repository';

@Injectable()
export class CategoryInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(async (category) => {
        fs.rename(
          PathUploadEnum.CATEGORY_PHOTO + process.env.TEMP_FOLDER,
          PathUploadEnum.CATEGORY_PHOTO + category.id,
          () => {},
        );

        // category.categoryPhoto = category.categoryPhoto.replace(
        //   process.env.TEMP_FOLDER,
        //   category.id,
        // );
        await this.categoryRepository.update(category.id, category);
      }),
    );
  }
}
