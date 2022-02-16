import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';

import { LimitedUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID:
        'fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62',
      clientSecret:
        '1c9aa5bd2286d287e667030165083668c66ccc4fe48b9f1a0940e213d9babef3',
      callbackURL: 'http://localhost:3000/user/auth/42/callback',
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ): Promise<any> {
    const getUser = lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: 'Bearer ' + accessToken },
      }),
    );

    const { id, login, email, image_url } = (await getUser).data;

    const user: LimitedUserDto = {
      id: id.toString(),
      login: login,
      name: '',
      avatar: '',
      fortyTwoAvatar: image_url,
      email: email,
      online: 1,
      twoFactorSecret: '',
      twoFactorQR: '',
    };

    if (login) await this.authService.ftValidUser(user);

    return cb(null, user);
  }
}
