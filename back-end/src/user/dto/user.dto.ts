
export interface UserDto {
	id: string;
	name: string;
	avatar: string;
	friends: string[];
	history: HistoryDto[]; // ?
	xp: number;
	level: number;
	created_at: Date;
	updated_at: Date;
}

export interface LimitedUserDto {
	id: string;
	name: string;
}

export interface HistoryDto {
	id: number;
	user_id: string;
	status: boolean; // win or lose
}
