import { Module } from '@nestjs/common';
import { AdminCommentController } from './admin-comment.controller';
import { AdminCommentService } from './admin-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment/comment.entity';
import { ExceptionService } from '../../common/services/exception.service';
import { User } from '../../entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  controllers: [AdminCommentController],
  providers: [AdminCommentService, ExceptionService],
})
export class AdminCommentModule {}
