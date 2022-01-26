import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2'
import { AuthService } from "./auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly authService: AuthService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: 'fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62',
            clientSecret: '1c9aa5bd2286d287e667030165083668c66ccc4fe48b9f1a0940e213d9babef3',
            callbackURL: 'http://localhost:3000/user/auth/42/callback',
            scope: ['public']
        });
      }

    async validate (accessToken: string, refreshToken: string, Profile: string) : Promise<any> {
      console.log('\naccessToken: ', accessToken);
      const user = await this.authService.valideUser(accessToken);

      // if (!user)
      // {
      //   console.log('exception\n');
      //   throw new UnauthorizedException();
      // }

      return user;
    }
}