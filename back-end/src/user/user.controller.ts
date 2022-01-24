import { Controller, Get, Post, Put, Param, Body, Redirect } from "@nestjs/common";
import { UserDto, LimitedUserDto, HistoryDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

	constructor(private readonly userService : UserService) {}

	@Post('create')
	createUser(
		@Body() user: LimitedUserDto
	) : Promise<UserDto> {
		// let newUser = undefined

		// try {
		// 	newUser = this.userService.createUser(user)
		// } catch (error) {
		// 	console.log(error);
		// }
		// return newUser

		return this.userService.createUser(user)
	}

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
