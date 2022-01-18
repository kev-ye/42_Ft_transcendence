import { Injectable } from '@nestjs/common';
import { UserDto, LimitedUserDto, HistoryDto } from './dto/user.dto';

@Injectable()
export class UserService {
	
	createUser(user: LimitedUserDto) : UserDto {
		if (!this.isUniqueUserName(user.name))
			return null // return 400
			
		console.log(`Creating profile: ${user.id} ${user.name}`)

		let newUser : UserDto = {
			id: user.id,
			name: user.name,
			avatar: `https://cdn.intra.42.fr/users/${user.id}.jpg`,
			friends: [],
			history: [],
			xp: 0,
			level: 1,
			created_at: new Date(),
			updated_at: new Date()
		}


		// add user here


		return newUser
	}

	getUsers() : LimitedUserDto[] {
		return []
	}

	getUserById(id: string) : LimitedUserDto {
		return this.getUsers().find(user => user.id === id)
	}

	getUserByName(name: string) : LimitedUserDto {
		return this.getUsers().find(user => user.name === name)
	}

	updateUser(id: string) : LimitedUserDto {
		const user : LimitedUserDto = this.getUserById(id)
		
		console.log(`updating user ${id}`)

		if (!user)
			return null // return 404
		

		// update user here


		return user // new_user infos instead
	}

	/*
	** check if the username is unique in the database
	** must be private for security reasons
	*/
	private isUniqueUserName(username : string) : boolean {
		return this.getUserByName(username) === undefined
	}
}
