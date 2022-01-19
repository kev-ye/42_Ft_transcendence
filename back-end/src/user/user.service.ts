import { Injectable } from '@nestjs/common';
import { UserDto, LimitedUserDto, HistoryDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserService {
	
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>
	) {}

	findAll(): Promise<UserEntity[]> {
		return this.usersRepository.find();
	}

	createUser(user: LimitedUserDto) : UserDto {
		if (!this.isUniqueUserName(user.name))
			return undefined // return 400
		
		console.log(`Creating profile: ${user.id} ${user.name}`)

		let newUser : UserDto = {
			id: '',
			login: user.id,
			name: user.name,
			avatar: '',
			fortyTwoAvatar: `https://cdn.intra.42.fr/users/${user.id}.jpg`,
			email: `${user.name}@gmail.com`
			// friends: [],
			// history: [],
			// xp: 0,
			// level: 1,
			// created_at: new Date(),
			// updated_at: new Date()
		}

		this.usersRepository.save(newUser)

		return newUser
	}

	async getUsers() : Promise<LimitedUserDto[]> {
		return (await this._getCompleteUsers()).map(user => {
			return {
				id: user.id,
				login: user.login,
				name: user.name,
				avatar: user.avatar,
				fortyTwoAvatar: user.fortyTwoAvatar,
				email: user.email
			}
		})
	}

	async getUserById(id: string) : Promise<UserDto> {
		return (await this._getCompleteUsers()).find(user => user.id === id)
	}

	async getUserByName(name: string) : Promise<UserDto> {
		return (await this._getCompleteUsers()).find(user => user.name === name)
	}

	async updateUser(id: string) : Promise<UserDto> {
		const user : UserDto = await this.getUserById(id)
		
		console.log(`updating user ${id}`)

		if (!user)
			return undefined // return 404
		

		// update user here


		return user // new_user infos instead
	}

	
	/////////////////////
	/* PRIVATE METHODS */
	/////////////////////

	private async _getCompleteUsers() : Promise<UserDto[]> {
		return await this.usersRepository.find()
	}

	/*
	** check if the username is unique in the database
	** must be private for security reasons
	*/
	private isUniqueUserName(username : string) : boolean {
		return this.getUserByName(username) === undefined
	}
}
