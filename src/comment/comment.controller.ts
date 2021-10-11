import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Comment } from '../entity/comment/comment.entity';
import { AddCommentDto } from './dto/add-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import setMulterConfig from '../config/multerconfig';
import { PathUploadEnum } from '../enum/path-upload.enum';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entity/user/user.entity';
import { UpdateResult } from 'typeorm';
import { CommentInterceptor } from '../interceptor/comment.interceptor';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('add-comment')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AddCommentDto,
  })
  @UseInterceptors(
    FileInterceptor(
      'commentPhoto',
      setMulterConfig(PathUploadEnum.COMMENT_PHOTO, false),
    ),
    CommentInterceptor,
  )
  async addComment(
    @Body() commentData: AddCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.addComment(commentData, file, user);
  }

  @Get('get-comments')
  async getAllAcceptedComments(): Promise<Comment[]> {
    return await this.commentService.getAcceptedComments();
  }

  @Get('get-comments/:postId')
  async getCommentsForPost(@Param('postId') postId: string) {
    return await this.commentService.getCommentsForPost(postId);
  }

  @Put('report-comment/:id')
  async reportComment(
    @Param('id') commentId: string,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return await this.commentService.reportComment(commentId, user);
  }
}
