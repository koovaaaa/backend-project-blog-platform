import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../entity/user/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/mail.service';
import { UpdateResult } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ExceptionService } from '../common/services/exception.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly exceptionService: ExceptionService,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.addUser(createUserDto);
  }

  async singIn(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userService.findUserByEmailOrUsername(
      loginDto.usernameOrEmail,
    );
    try {
      await this.checkPassword(user, loginDto);

      const payload: JwtPayloadInterface = { username: user.username };
      const token: string = this.jwtService.sign(payload);

      return { token };
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const getUserByEmail = await this.userService.findUserByEmailOrUsername(
      forgotPasswordDto.usernameOrEmail,
    );
    if (!getUserByEmail) throw new NotFoundException();
    const token = this.jwtService.sign(
      { username: getUserByEmail.username },
      {
        secret: process.env.JWT_SECRET_FOR_PASSWORD_RESET,
        expiresIn: parseInt(process.env.JWT_TOKEN_RESET_PASSWORD_EXPIRES),
      },
    );

    await this.mailService.sendMailForNewPassword(
      getUserByEmail.email,
      token,
      getUserByEmail.username,
    );
  }

  async resetPassword(
    id: string,
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<UpdateResult> {
    try {
      const user = await this.userService.findOne(id);
      const checkUser = await this.jwtService.decode(token);

      await this.checkIfUserExist(checkUser, user);

      const currentTimestamp = Math.round(Date.now() / 1000);
      const expiresAt = checkUser['exp'];

      await this.checkIfJwtTokenExpired(currentTimestamp, expiresAt);

      return this.userService.changeForgottenPassword(resetPasswordDto, user);
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  async checkPassword(user: User, loginDto: LoginDto) {
    if ((await bcrypt.hash(loginDto.password, user.salt)) !== user.password) {
      throw new NotFoundException();
    }
  }

  async googleLogin(req): Promise<{ user: User; token: string }> {
    try {
      let user = await this.userRepository.findOne({
        where: { username: req.user.id },
      });
      if (user) {
        user.accessToken = req.user.accessToken;
        user = await this.userRepository.save(user);
      } else {
        user = new User({
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          username: req.user.id,
          email: req.user.email,
          accessToken: req.user.accessToken,
        });
        await this.userRepository.save(user);
      }
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user, token };
    } catch (e) {
      this.exceptionService.handleError(e);
    }
  }

  checkIfJwtTokenExpired(currentTimestamp, expiresAt) {
    if (currentTimestamp > expiresAt) throw new BadRequestException();
  }

  checkIfUserExist(checkUser, user) {
    if (checkUser['username'] !== user.username) throw new NotFoundException();
  }
}
