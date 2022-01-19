import { Controller, Get, Post, Put, Param, Body } from "@nestjs/common";
import { UserDto, LimitedUserDto, HistoryDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

	constructor(private readonly userService : UserService) {}

	@Post('create')
	createUser(
		@Body() user: LimitedUserDto,
	) : UserDto {
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

	@Get('name/:name')
	getUserByName(
		@Param('name') name: string
	) : Promise<UserDto> {
		return this.userService.getUserByName(name)
	}

	@Put('update/:id')
	updateUser(
		@Param('id') id: string
	) : Promise<UserDto> {
		return this.userService.updateUser(id)
	}
}
