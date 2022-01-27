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

  async valideUser(login: string): Promise<any> {
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      const createUser: LimitedUserDto = {
        id: '',
        name: '',
        avatar: '',
        login: login,
        fortyTwoAvatar: '',
        email: ''
      };
      console.log('create user: ', createUser);
      await this.userService.createUserByLogin(createUser);
    }
  }

}
