import { Controller, Get, Post, Put, Req, Res, Param, Body, Redirect, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { REFUSED } from "dns";

import { UserDto, LimitedUserDto, HistoryDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

	constructor(private readonly userService : UserService) {}

	@Get()
	getUsers() : Promise<LimitedUserDto[]> {
		return this.userService.getUsers()
	}

	@Get('id/:id')
	getUserById(
		@Param('id') id: string
	) : Promise<LimitedUserDto> {
		return this.userService.getUserById(id)
	}

	@Get('login/:login')
	getUserByLogin(
		@Param('login') login: string
	) : Promise<LimitedUserDto> {
		return this.userService.getUserByLogin(login)
	}

	@Get('name/:name')
	getUserByName(
		@Param('name') name: string
	) : Promise<UserDto> {
		return this.userService.getUserByName(name)
	}

	@Post('create')
	createUser(
		@Body() user: LimitedUserDto
	) : Promise<UserDto> {
		return this.userService.createUser(user)
	}

	@Put('update')
	updateUserById(
		@Body() user: UserDto
	) : Promise<UserDto> {
		return this.userService.updateUserById(user)
	}

	@Get('delete/:id')
	deleteUserById(
		@Param('id') id: string
	) {
		return this.userService.deleteUserById(id)
	}

  // auth

  @Post('auth/42/callback')
  @UseGuards(AuthGuard('42'))
  ftAuthCallback(@Req() req: any): any {
    console.log(req.user);
    const { id } = req.user;
  
    return { id };
  }
}
