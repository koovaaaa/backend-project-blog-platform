import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminCommentService } from './admin-comment.service';
import { Comment } from '../../entity/comment/comment.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangeStatusDto } from './dto/change-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { UpdateResult } from 'typeorm';

@ApiTags('Admin Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin-comment')
export class AdminCommentController {
  constructor(private readonly adminCommentService: AdminCommentService) {}
  @Get('pending-comments')
  async getCommentsWithStatusPending(): Promise<Comment[]> {
    return await this.adminCommentService.getPendingComments();
  }

  @Get('reported-comments')
  async getCommentsWithStatusReported(): Promise<Comment[]> {
    return await this.adminCommentService.getReportedComments();
  }

  @Put('edit-comment/:id')
  async changeCommentStatus(
    @Param('id') commentId: string,
    @Body() { commentStatus }: ChangeStatusDto,
  ): Promise<UpdateResult> {
    return await this.adminCommentService.changeCommentStatus(
      commentId,
      commentStatus,
    );
  }

  @Delete('delete-comment/:id')
  async deleteComment(@Param('id') id: string) {
    return await this.adminCommentService.deleteComment(id);
  }
}
