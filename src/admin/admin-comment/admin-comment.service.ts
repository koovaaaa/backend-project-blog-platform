import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment/comment.entity';
import { CommentRepository } from '../../repository/comment/comment.repository';
import { ExceptionService } from '../../common/services/exception.service';
import { CommentStatusEnum } from '../../enum/comment-status.enum';
import { UpdateResult } from 'typeorm';
import { User } from '../../entity/user/user.entity';
import { UserRepository } from '../../repository/user/user.repository';
import * as fs from 'fs';
import { PathUploadEnum } from '../../enum/path-upload.enum';

@Injectable()
export class AdminCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: CommentRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly exceptionService: ExceptionService,
  ) {}

  async getPendingComments(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { commentStatus: CommentStatusEnum.PENDING },
      });
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async getReportedComments(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { commentStatus: CommentStatusEnum.REPORTED },
      });
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async changeCommentStatus(
    commentId: string,
    commentStatus: CommentStatusEnum,
  ): Promise<UpdateResult> {
    try {
      await this.rejectCommentAndUpdateUser(commentStatus, commentId);

      return await this.commentRepository.update(commentId, { commentStatus });
    } catch (e) {
      await this.exceptionService.handleError(e);
    }
  }

  async rejectCommentAndUpdateUser(
    commentStatus: CommentStatusEnum,
    commentId: string,
  ): Promise<void> {
    if (commentStatus === CommentStatusEnum.REJECTED) {
      const comment = await this.commentRepository.findOneOrFail(commentId, {
        relations: ['createdBy'],
      });
      comment.createdBy.rejectedComments += 1;
      if (
        comment.createdBy.rejectedComments >=
        parseInt(process.env.LIMIT_FOR_BAD_COMMENTS)
      )
        comment.createdBy.isEnabled = false;
      await this.userRepository.update(comment.createdBy.id, {
        rejectedComments: comment.createdBy.rejectedComments,
        isEnabled: comment.createdBy.isEnabled,
      });
      fs.rmdir(
        PathUploadEnum.COMMENT_PHOTO + commentId,
        { recursive: true },
        () => {},
      );
      await this.commentRepository.delete(commentId);
    }
  }

  async deleteComment(id: string) {
    try {
      fs.rmdir(
        PathUploadEnum.COMMENT_PHOTO + id,
        { recursive: true },
        () => {},
      );
      return await this.commentRepository.delete(id);
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }
}
