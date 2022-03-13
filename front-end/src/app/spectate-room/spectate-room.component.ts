import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
	templateUrl: './spectate-room.component.html',
	styleUrls: ['./spectate-room.component.css'],
	selector: 'spectate-room'
}) export class SpectateRoom implements OnInit {

	// games: {
	// 	id: string,
	// 	created: Date,
	// 	first: string,
	// 	second: string,
	// 	first_user: string,
	// 	second_user: string,
	// 	first_score: number,
	// 	second_score: number,
	// 	limit_game: number,
	// 	game_state: number,
	// 	creator_id: string
	// } [] = [];
	games: Array<any> = [];

	constructor(private router: Router, private http: HttpClient) {
	}

	ngOnInit(): void {
		this.http.get('/pongApi/game/').subscribe((games: any) => {
			if (games) {
				this.games = games.filter((game: any) => game.game_state === 1);
			}
		});
	}

	getToGameRoom(): any {
		this.router.navigate(['game_room']).then();
	}

	spectateGame(id: string) {
		if (id == "")
			return;
		this.router.navigate(['play'], { queryParams: { spec: id } });
	}
}
