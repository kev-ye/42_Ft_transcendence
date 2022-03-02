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
