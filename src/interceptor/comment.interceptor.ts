import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entity/comment/comment.entity';
import { CommentRepository } from '../repository/comment/comment.repository';
import * as fs from 'fs';
import { PathUploadEnum } from '../enum/path-upload.enum';

@Injectable()
export class CommentInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: CommentRepository,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(async (comment) => {
        fs.rename(
          PathUploadEnum.COMMENT_PHOTO + process.env.TEMP_FOLDER,
          PathUploadEnum.COMMENT_PHOTO + comment.id,
          () => {},
        );

        comment.commentPhoto = comment.commentPhoto.replace(
          process.env.TEMP_FOLDER,
          comment.id,
        );
        await this.commentRepository.update(comment.id, comment);
      }),
    );
  }
}
