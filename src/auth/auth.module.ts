import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { User } from '../entity/user/user.entity';
import { CommonService } from '../common/services/common.service';
import { BlogPost } from '../entity/post/post.entity';
import { UserRepository } from '../repository/user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserPhoto } from '../entity/user-photo/user-photo.entity';
import { UserPhotoRepository } from '../repository/user-photo/user-photo.repository';
import { MailModule } from '../mail/mail.module';
import { ExceptionService } from '../common/services/exception.service';
import { ThumbService } from '../common/services/thumb.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_TOKEN_LOGIN_EXPIRES),
      },
    }),
    TypeOrmModule.forFeature([
      User,
      BlogPost,
      UserRepository,
      UserPhoto,
      UserPhotoRepository,
    ]),
    MailModule,
  ],
  providers: [
    AuthService,
    UserService,
    CommonService,
    JwtStrategy,
    ExceptionService,
    ThumbService,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
