- [ ] docker compose


- [ ] front-end


- [ ] bdd
	- user (see @user_account)
		42id
		name
		avatar (url OR encryption)
		-> @friends
		-> @history
		-> @level


- [ ] chat
	- chat
	- channel
		public
			(password) -> protected
		private

		password management
		view user profile
		mute / block user
		invitation (to game / to join)


- [ ] user account
	- OAuth system -> back / bdd
	- unique name / id
	- level / stats
	- match history
	
	- create page on first visit to complete those infos:
		display user preferences

	- preferences:
		change / generate avatar
		(2 factor auth)

	- friends:
		list of friends
		search
		add friend
		remove friend
		block / unblock
		mute / unblock
		status (online / offline)


- [ ] game
	- spectator OR player mode
	- match making OR create private game (with friends)
	- game room preferences
	- error management (disconnects / lag)



front-end
bdd -> user account -> chat
					   friends
					   preferences
					   game



- [ ] game
	- front:
		- customization
		- game room
			- match making
			- create private game
			- spectator
				- list
		- game
			- treat signals
	- back:
		- receive signals



- startRound() : 
- input(treshold : number) : void
- endGame() : void

[//]: # (--- BUG ---)

[//]: # (After match-making, before game start)

- [ ] if one of user quit 
    case1: try to make a match-making again show: Could not connect to game server
    case2: game of user (not quit) still start
- [ ] After this: back server down (const user_2 = await this.userService.getUserById(player_2.user_id);)

[//]: # (Game start)

- [ ] if one of user quit before game started, the winner is the rage-quit user

[//]: # (Game end ... nothing now)

