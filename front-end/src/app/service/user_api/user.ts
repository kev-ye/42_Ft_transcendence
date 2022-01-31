export interface User {
  id: string;
	login: string;
	name: string;
	avatar: string;
	fortyTwoAvatar: string;
	email: string;
  online: boolean;
  token: string;
}

export interface LocalUser {
  name: string;
  avatar: string;
	fortyTwoAvatar: string;
}