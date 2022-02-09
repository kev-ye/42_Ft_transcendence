import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-oauth2'
import { lastValueFrom } from "rxjs";
// import { Strategy } from "passport-42";

import { LimitedUserDto } from "src/user/dto/user.dto";
import { AuthService } from "./auth.service";


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
      private readonly authService: AuthService,
      private readonly httpService: HttpService) {
        super({
          authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: 'dff6b306ea79df3603c349d11e8ba9de3595ba4ebddc08321158cb53c40bc847',
            clientSecret: '7197e12d228c0bc2e3bc3876ec14c2b262e8d56fcbb62ac3ec054c41c877cffe',
            callbackURL: 'http://localhost:3000/user/42/auth/callback',
            scope: ['public']
        });
      }

    async validate (accessToken: string, refreshToken: string, profile: any, cb: any) : Promise<any> {
      const getUser = lastValueFrom(this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: { "Authorization": "Bearer " + accessToken }
        }));
      
      const { id, login, email, image_url } = (await getUser).data;

			const userData = lastValueFrom(this.httpService.get(`https://api.intra.42.fr/v2/users/${id}`, {
					headers: { "Authorization": "Bearer " + accessToken }
					}));

			// console.log('User data:', (await userData).data);

      const user: LimitedUserDto = {
        id: id.toString(),
        login: login,
        name: '',
        avatar: '',
        fortyTwoAvatar: image_url,
        email: email,
        online: 'online',
				twoFactor: false,
				twoFactorId: ''
      };

      if (login)
        await this.authService.valideUser(user);

      return cb(null, user);
    }
}