import { Controller, Get, Post, Put, Param, Body } from "@nestjs/common";
import { UserDto, LimitedUserDto, HistoryDto } from "./dto/user.dto";

@Controller('user')
export class UserController {


	@Post('create')
	createUser(
		@Body('id') id: string,
		@Body('name') name: string
	) : UserDto {

		if (!this.isUniqueUserName(name))
			return null // return 400
			
		console.log(`Creating profile: ${id} ${name}`)

		let user : UserDto = {
			id: id,
			name: name,
			avatar: `https://cdn.intra.42.fr/users/${id}.jpg`,
			friends: [],
			history: [],
			xp: 0,
			level: 1,
			created_at: new Date(),
			updated_at: new Date()
		}


		// add user here


		return user
	}


	/*
	** check if the username is unique in the database
	** must be private for security reasons
	*/
	isUniqueUserName(username : string) : boolean {
		const users : LimitedUserDto[] = this.getUsers();

		for (let i = 0; i < users.length; ++i) {
			if (users[i].name === username)
				return false
		}
		return true
	}


	@Get()
	getUsers() : LimitedUserDto[] {
		return []
	}


	@Get('/id/:id')
	getUserById(
		@Param('id') id: string
	) : LimitedUserDto {
		const users : LimitedUserDto[] = this.getUsers();
		
		for (let i = 0; i < users.length; ++i) {
			if (users[i].id === id)
				return users[i]
		}
		return null // return 404
	}


	@Get('/name/:name')
	getUserByName(
		@Param('name') name: string
	) : LimitedUserDto {
		const users : LimitedUserDto[] = this.getUsers();

		for (let i = 0; i < users.length; ++i) {
			if (users[i].name === name)
				return users[i]
		}
		return null // return 404
	}


	@Put('/update/:id')
	updateUser(
		@Param('id') id: string
	) : LimitedUserDto {
		const user : LimitedUserDto = this.getUserById(id);
		
		console.log(`updating user ${id}`)

		if (!user)
			return null // return 404
		

		// update user here


		return user // new_user infos instead
	}

}
