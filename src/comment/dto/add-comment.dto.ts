import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BlogPost } from '../../entity/post/post.entity';

export class AddCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
  @ApiProperty()
  @IsNotEmpty()
  post: BlogPost;
  @ApiProperty({ type: 'string', format: 'binary' })
  commentPhoto: any;
}
