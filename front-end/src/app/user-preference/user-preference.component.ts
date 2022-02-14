import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserPreferenceService } from '../service/user-preference/user-preference.service';
import { lastValueFrom } from 'rxjs';
import { GlobalConsts } from '../common/global';

@Component({
  selector: 'app-user-preference',
  templateUrl: './user-preference.component.html',
  styleUrls: ['./user-preference.component.css']
})
export class UserPreferenceComponent implements OnInit {

	user : any = {
		id: 'besellem',
	};

	constructor(
		private http : HttpClient,
		private userPreference: UserPreferenceService
	) { }

	ngOnInit(): void {
		lastValueFrom(this.http.get(`${GlobalConsts.userApi}/user/id`, { withCredentials: true }))
		.then((data) => {
			this.user = data;
			console.log(this.user);
		})
		.catch((err) => {
			console.error(err);
		});
		// .subscribe({
		// 	next: (user) => {
		// 		this.user = {...user}
		// 		console.log(this.user);
		// 	}
		// });

		console.log('TO DEBUG', this.user);
	}

	updateUsername(username : string) : void {
		if (this.userPreference.updateUsername(this.user.id, username))
			this.user.name = username;
	}
}
