import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entity/comment/comment.entity';
import { ExceptionService } from '../common/services/exception.service';
import { ThumbService } from '../common/services/thumb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService, ExceptionService, ThumbService],
})
export class CommentModule {}
