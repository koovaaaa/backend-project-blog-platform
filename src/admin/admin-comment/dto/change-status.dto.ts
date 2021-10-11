import { CommentStatusEnum } from '../../../enum/comment-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangeStatusDto {
  @ApiProperty()
  @IsEnum(CommentStatusEnum)
  commentStatus: CommentStatusEnum;
}
