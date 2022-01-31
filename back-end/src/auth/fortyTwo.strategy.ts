import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from "passport-42";
import { v4 as uuid } from 'uuid';

import { LimitedUserDto } from "src/user/dto/user.dto";
import { AuthService } from "./auth.service";


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: 'fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62',
            clientSecret: '1c9aa5bd2286d287e667030165083668c66ccc4fe48b9f1a0940e213d9babef3',
            callbackURL: 'http://localhost:4200/callback',
            profileFields: {
              'id': function (obj: any) { return String(obj.id); },
              'username': 'login',
              'displayName': 'displayname',
              'name.familyName': 'last_name',
              'name.givenName': 'first_name',
              'profileUrl': 'url',
              'emails.0.value': 'email',
              'phoneNumbers.0.value': 'phone',
              'photos.0.value': 'image_url'
            }
        });
      }

    async validate (accessToken: string, refreshToken: string, profile: any, cb: any) : Promise<any> {
      console.log(accessToken);
      // console.log(profile);
      const { id, username, emails, photos } = profile;
      
      const user: LimitedUserDto = {
        id: id,
        login: username,
        name: '',
        avatar: '',
        fortyTwoAvatar: photos[0].value,
        email: emails[0].value,
        online: true,
        accessToken
      };

      if (username)
        await this.authService.valideUser(user);

      return cb(null, user);
    }
}