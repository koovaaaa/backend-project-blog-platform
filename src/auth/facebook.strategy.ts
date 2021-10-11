import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {}
