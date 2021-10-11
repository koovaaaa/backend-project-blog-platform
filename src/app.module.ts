import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import typeOrmConfig from './config/typeormconfig';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { CommentModule } from './comment/comment.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CategoryInterceptor } from './interceptor/category.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    CategoryModule,
    PostModule,
    AuthModule,
    AdminModule,
    MailModule,
    CommentModule,
  ],
  controllers: [],
})
export class AppModule {}
