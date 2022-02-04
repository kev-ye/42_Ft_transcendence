import { Controller, Get, Post, Put, Delete, Req, Res , Param, Body, UseGuards, Header, Head, Redirect} from "@nestjs/common";
import express, { Request, Response } from "express";
import { AuthGuard } from '@nestjs/passport';

import { UserDto, LimitedUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

	constructor(private readonly userService : UserService) {}

	@Get()
	getUsers() : Promise<LimitedUserDto[]> {
		return this.userService.getUsers()
	}

	@Get('id')
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
	getUserById(@Req() req: any) : Promise<LimitedUserDto> {
    const id = req.signedCookies.userId;

		return this.userService.getUserById(id)
	}

	@Get('login/:login')
	getUserByLogin(@Param('login') login: string) : Promise<LimitedUserDto> {
		return this.userService.getUserByLogin(login)
	}

	@Get('name/:name')
	getUserByName(@Param('name') name: string) : Promise<UserDto> {
		return this.userService.getUserByName(name)
	}

	@Post('create')
	createUser(@Body() user: LimitedUserDto) : Promise<UserDto> {
		return this.userService.createUser(user)
	}

	@Put('create/first')
	@Header('Access-Control-Allow-Origin', 'http://localhost:4200')
	firstUserCreate(@Req() req: any, @Body() name: any) : Promise<UserDto> {
		const id: string = req.signedCookies.userId;
		
		return this.userService.firstUserCreate(id, name.name);
	}

	@Put('update')
	updateUserById(@Body() user: UserDto) : Promise<UserDto> {
		return this.userService.updateUserById(user)
	}

	@Get('delete/:id')
	deleteUserById(@Param('id') id: string) {
		return this.userService.deleteUserById(id)
	}

  // auth

  @Get('42/auth/login')
  @UseGuards(AuthGuard('42'))
  async ftAuth(): Promise<void> {}

  @Get('42/auth/callback')
  @Redirect('http://localhost:4200/main')
  @UseGuards(AuthGuard('42'))
  ftAuthC(@Req() req: any, @Res() res: any): void {
    const user: UserDto = req.user;

    res.cookie('userId', user.id, {
      httpOnly: true,
      signed: true
    });
  }
	
  @Delete('42/auth/logout')  
  @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
  getCookie(@Res() res: any) {
    res.clearCookie('userId');
    res.send('');
  }

}
