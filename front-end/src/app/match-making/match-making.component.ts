import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field'
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-match-making',
	templateUrl: './match-making.component.html',
	styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent implements OnInit {

	private n: number = 10;

	constructor(private router: Router, private http: HttpClient) { }

	ngOnInit(): void {
	}

	getToGameRoom(): any {
		this.router.navigate(['room']).then();
	}

	matchMaking(value: any): any {
		this.http.post(`/api/game/custom`, {limit_game: value}).subscribe((res: any) => {
			if (res && res.id)
				this.router.navigate(['game'], {queryParams: {
					id: res.id
				}})
		});
		
	}

	joinGame(id: string) {
		this.router.navigate(['game'], {queryParams: {
			id: id
		}});
	}

	startMatchmaking() {
		this.router.navigate(['game']);
	}

	selectChangeHandler(event: any) {
		this.n = event.target.value;
	}
}
