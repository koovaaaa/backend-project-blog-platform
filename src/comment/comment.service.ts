import { Injectable } from '@nestjs/common';
import { AddCommentDto } from './dto/add-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entity/comment/comment.entity';
import { CommentRepository } from '../repository/comment/comment.repository';
import { ExceptionService } from '../common/services/exception.service';
import { User } from '../entity/user/user.entity';
import { CommentStatusEnum } from '../enum/comment-status.enum';
import { ThumbService } from '../common/services/thumb.service';
import { UpdateResult } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: CommentRepository,
    private readonly exceptionService: ExceptionService,
    private readonly thumbService: ThumbService,
  ) {}
  async addComment(
    commentData: AddCommentDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Comment> {
    try {
      let comment = new Comment(commentData);
      comment.createdBy = user;
      comment.commentPhoto =
        file.destination.replace(process.env.ROOT_UPLOAD_FOLDER, '') +
        '/' +
        file.filename;

      comment = await this.commentRepository.save(comment);

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

      return comment;
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async getAcceptedComments(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { commentStatus: CommentStatusEnum.ACCEPTED },
      });
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async reportComment(commentId: string, user: User): Promise<UpdateResult> {
    try {
      const comment = await this.commentRepository.findOneOrFail(commentId, {
        where: { commentStatus: CommentStatusEnum.ACCEPTED },
      });
      return await this.commentRepository.update(comment.id, {
        commentStatus: CommentStatusEnum.REPORTED,
        reportedBy: user,
        reportedAt: new Date(),
      });
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async getCommentsForPost(postId: string) {
    try {
      return await this.commentRepository.find({
        where: { post: postId, commentStatus: CommentStatusEnum.ACCEPTED },
      });
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }
}
