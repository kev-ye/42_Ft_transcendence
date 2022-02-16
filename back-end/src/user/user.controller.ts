import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Redirect,
  Header,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserDto, LimitedUserDto } from './dto/user.dto';
import { UserService } from './user.service';

import * as twoFa from 'node-2fa';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<LimitedUserDto[]> {
    return this.userService.getUsers();
  }

  @Get('id')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  async getUserById(@Req() req: any, @Res() res: any): Promise<void> {
    console.log('get id:', req.session.userId);
    const id = req.session.userId;
    const user = await this.userService.getUserById(id);

    if (user) res.status(200).json(user);
    else
      res.status(401).json({
        'Error message': 'Unauthorized Access',
      });
  }

  @Get('login/:login')
  getUserByLogin(@Param('login') login: string): Promise<LimitedUserDto> {
    return this.userService.getUserByLogin(login);
  }

  @Get('name/:name')
  getUserByName(@Param('name') name: string): Promise<UserDto> {
    return this.userService.getUserByName(name);
  }

  @Post('create')
  createUser(@Body() user: LimitedUserDto): Promise<UserDto> {
    return this.userService.createUser(user);
  }

  @Put('create/first')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  firstUserCreate(@Req() req: any, @Body() name: any): Promise<UserDto> {
    console.log('id:', req.session.userId);
    const id: string = req.session.userId;

    return this.userService.firstUserCreate(id, name.name);
  }

  @Put('update')
  updateUserById(@Body() user: UserDto): Promise<UserDto> {
    return this.userService.updateUserById(user);
  }

  @Get('delete/:id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }

  /*
   * Auth
   */

  // login/logout

  @Get('auth/42/login')
  @UseGuards(AuthGuard('42'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async ftLogIn(): Promise<void> {}

  @Get('auth/42/callback')
  @Redirect('http://localhost:4200/main')
  @UseGuards(AuthGuard('42'))
  ftAuthCallback(@Req() req: any): void {
    const user: LimitedUserDto = req.user;

    if (user) req.session.userId = user.id;
  }

  @Get('isLogin')
  async isLogin(@Req() req: any) {
    const id = req.session.userId;
    const user = await this.userService.getUserById(id);

    return !!user;
  }

  @Post('auth/logout')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  async logOut(@Req() req: any, @Res() res: any) {
    const user: UserDto = await this.userService.getUserById(
      req.session.userId,
    );
    if (user) {
      user.online = 0;
      await this.userService.updateUser(user);
    }
    req.session.destroy((err) => {
      if (err) console.log('error by session destroy:', err);
    });
    res.status(200).json({
      ok: 'ok',
    });
  }

  // Two-factor authentication

  @Post('auth/2fa/generate')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  async twoFaGenerate(@Req() req: any, @Res() res: any): Promise<void> {
    const user: UserDto = await this.userService.getUserById(
      req.session.userId,
    );

    if (user) {
      const newSecret = twoFa.generateSecret({
        name: 'TwoFactorAuthentication',
        account: user.login,
      });
      user.twoFactorSecret = newSecret.secret;
      user.twoFactorQR = newSecret.qr;
      await this.userService.updateUser(user);

      res.status(200).json(newSecret);
    } else
      res.status(401).json({
        'Error message': 'Unauthorized Access',
      });
  }

  @Delete('auth/2fa/turnoff')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  async twoFaTurnOff(@Req() req: any, @Res() res: any): Promise<void> {
    const user: UserDto = await this.userService.getUserById(
      req.session.userId,
    );

    if (user) {
      user.twoFactorSecret = '';
      user.twoFactorQR = '';
      await this.userService.updateUser(user);

      res.status(200).json({
        ok: 'ok',
      });
    } else
      res.status(401).json({
        'Error message': 'Unauthorized Access',
      });
  }

  @Post('auth/2fa/verify')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  async twoFaVerify(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<void> {
    const user: UserDto = await this.userService.getUserById(
      req.session.userId,
    );

    if (user) {
      const result = twoFa.verifyToken(user.twoFactorSecret, body.token);
      if (result && result.delta === 0) {
        user.online = 1;
        await this.userService.updateUser(user);
      }
      res.status(200).json(result ? result : { delta: -2 });
    } else
      res.status(401).json({
        'Error message': 'Unauthorized Access',
      });
  }
}
