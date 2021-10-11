import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../entity/user/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateResult } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signUp(createUserDto);
  }

  @Post('login')
  async singIn(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return await this.authService.singIn(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req): Promise<{ user: User; token: string }> {
    return await this.authService.googleLogin(req);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('forgot-password/:id/:token')
  resetPassword(
    @Param('id') userId: string,
    @Param('token') token: string,
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ): Promise<UpdateResult> {
    return this.authService.resetPassword(userId, token, resetPasswordDto);
  }
}
