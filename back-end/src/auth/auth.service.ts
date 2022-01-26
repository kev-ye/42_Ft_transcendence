import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { LimitedUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService
  ) {}

  async valideUser(accessToken: string): Promise<any> {
    this.httpService.get('https://api.intra.42.fr/v2/me', {
      headers: { "Authorization": "Bearer " + accessToken }
    })
    .subscribe(async (result) => {
      const { login } = result.data;
      if (login) {
        console.log('login: ', login);
        const user = await this.userService.getUserByLogin(login);
        
        if (user)
        {
          console.log('ret user');
          return user;
        }
        else {
          const createUser: LimitedUserDto = {
            id: '',
            name: '',
            avatar: '',
            login: login,
            fortyTwoAvatar: '',
            email: ''
          };
          console.log('create user: ', createUser);
          return await this.userService.createUser(createUser);
        }
      }
    });
    console.log('here\n');
    return 'ok';
  }

}
