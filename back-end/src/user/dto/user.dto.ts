
export interface UserDto {
	id: string;
	login: string;
	name: string;
	avatar: string;
	fortyTwoAvatar: string;
	email: string;
  online: string;
	twoFactor: boolean;
	twoFactorId: string;
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
  online: string;
	twoFactor: boolean;
	twoFactorId: string;
}

export interface HistoryDto {
	id: number;
	user_id: string;
	status: boolean; // win or lose
}
