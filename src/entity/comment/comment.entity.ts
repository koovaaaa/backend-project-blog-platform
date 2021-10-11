import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentStatusEnum } from '../../enum/comment-status.enum';
import { User } from '../user/user.entity';
import { BlogPost } from '../post/post.entity';

@Entity()
export class Comment {
  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({ default: CommentStatusEnum.PENDING })
  commentStatus: CommentStatusEnum;

  @ManyToOne(() => BlogPost)
  post: BlogPost;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  commentPhoto: string;

  @ManyToOne(() => User, { nullable: true })
  reportedBy: User;

  @Column({ default: null })
  reportedAt: Date;
}
