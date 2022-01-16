import { Controller, Get, Post, Put, Param, Body } from "@nestjs/common";


@Controller('profile')
export class ProfileController {

	@Post()
	createProfile(
		@Body('name') name: string,
		@Body('lastName') lastName: string
	) {
		return `Create profile: ${name} ${lastName}`
	}

	@Get()
	getProfiles() {
		return []
	}

	@Get('/:id')
	getProfileById(
		@Param('id') id: string
	) {
		return id
	}

	@Put('/:id')
	updateProfile(
		@Param('id') id: string
	) {
		return `update profile ${id}`
	}

}
