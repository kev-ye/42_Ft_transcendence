import {
	Controller,
	Get, Post, Put, Delete,
	Req, Res,
	Redirect, Header, UseGuards,
	Param, Body, Session
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { UserDto, LimitedUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

import * as twoFa from 'node-2fa';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService) {}

	@Get()
	getUsers() : Promise<LimitedUserDto[]> {
		return this.userService.getUsers()
	}

  @Get('id')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  getUserById(@Req() req: any): Promise<LimitedUserDto> {
    // console.log('id:', req.session.userId);
    const id = req.session.userId;
    return this.userService.getUserById(id);
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

// login/logout by 42

  @Get('auth/42/login')
  @UseGuards(AuthGuard('42'))
  async ftAuth(): Promise<void> {}

  @Get('auth/42/callback')
  @Redirect('http://localhost:4200/main')
  @UseGuards(AuthGuard('42'))
  ftAuthCallback(@Req() req: any): void {
    const user: LimitedUserDto = req.user;

		if (user)
			req.session.userId = user.id;
  }
	
  @Delete('auth/logout')  
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  getCookie(@Req() req: any, @Res() res: any) {
		req.session.destroy(err => {
			if (err)
				console.log('error by session destroy:', err);
			});
		res.status(200).json({
			ok: "ok"
		});
  }

// Two-factor authentication

	@Post('auth/2fa/generate')
	@Header('Access-Control-Allow-Origin', 'http://localhost:4200')
	async twoFaGenerate(@Req() req: any, @Res() res: any): Promise<void> {
		let user: UserDto = await this.userService.getUserById(req.session.userId);

		if (user) {
			const newSecret = twoFa.generateSecret({
				name: "TwoFactorAuthentication",
				account: user.name
			});
			user.twoFactorSecret = newSecret.secret;
			this.userService.updateUserByTF(user);

			res.status(200).json(newSecret);
		}
		else
			res.status(401).json({
				"Error message": "Unauthorized Access"
			})
	}

	@Delete('auth/2fa/turnoff')  
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
	async twoFaTurnOff(@Req() req: any, @Res() res: any): Promise<void> {
		let user: UserDto = await this.userService.getUserById(req.session.userId);

		if (user) {
			user.twoFactorSecret = '';
			this.userService.updateUserByTF(user);

			res.status(200).json({
				ok: "ok"
			});
		}
		else
			res.status(401).json({
				"Error message": "Unauthorized Access"
			})
	}

	@Post('auth/2fa/verif')
	@Header('Access-Control-Allow-Origin', 'http://localhost:4200')
	async twoFaVerif(@Req() req: any, @Res() res: any, @Body() body: any): Promise<void> {
		const user: UserDto = await this.userService.getUserById(req.session.userId);

		if (user) {
			// console.log('get secret:', user.twoFactorSecret);
			// console.log('get body token:', body.token)
			const result = twoFa.verifyToken(user.twoFactorSecret, body.token);
			res.status(200).json(result? result : {
				delta: -2
			});
		}
		else
			res.status(401).json({
				"Error message": "Unauthorized Access"
			})
	}

}
