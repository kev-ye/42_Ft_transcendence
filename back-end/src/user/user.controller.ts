import { Controller, Get, Post, Put, Param, Body, Redirect, Inject } from "@nestjs/common";
import { UserDto, LimitedUserDto, HistoryDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

	constructor(@Inject('USER_SERVICE') private readonly userService : UserService) {}

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
}
