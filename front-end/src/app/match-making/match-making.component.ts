import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field'

@Component({
	selector: 'app-match-making',
	templateUrl: './match-making.component.html',
	styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent implements OnInit {

	private n: number = 10;

	constructor(private router: Router) { }

	ngOnInit(): void {
	}

	getToGameRoom(): any {
		this.router.navigate(['room']).then();
	}

	matchMaking(): any {
		this.router.navigate(['game']).then();
	}

	selectChangeHandler(event: any) {
		this.n = event.target.value;
	}
}
