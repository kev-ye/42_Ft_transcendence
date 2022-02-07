
export interface UserDto {
	id: string;
	login: string;
	name: string;
	avatar: string;
	fortyTwoAvatar: string;
	email: string;
	// friends: string[];
	// history: HistoryDto[]; // ?
	// xp: number;
	// level: number;
	// updated: Date;
}

export interface LimitedUserDto {
	id: string;
	login: string;
	name: string;
	avatar: string;
	fortyTwoAvatar: string;
	email: string;
}

export interface HistoryDto {
	id: string;
	user_id: string;
	status: boolean; // win or lose
}
