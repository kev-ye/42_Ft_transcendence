import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: '461446467482-nm6144dflavue01tn33ei9e98v9eahd6.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/user/auth/google/callback',
      scope: ['profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id } = profile;

    const user = {
      id: id
    };

    done(null, user);
  }
}