import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalConsts } from '../common/global';
import { HttpClient } from '@angular/common/http';
import { UserPreferenceService } from '../service/user-preference/user-preference.service';

@Component({
  selector: 'app-user-preference',
  templateUrl: './user-preference.component.html',
  styleUrls: ['./user-preference.component.css']
})
export class UserPreferenceComponent implements OnInit {

	// subscribeToUsernameVisibility : Subscription;

	user : any = {
		name: 'besellem',
		avatar: 'https://cdn.intra.42.fr/users/ppoinsin.jpg',
		email: 'besellem@42.student.fr'
	};

	constructor(
		private http : HttpClient,
		private userPreference: UserPreferenceService
	) { }

	ngOnInit(): void {
		// this.http.get(`${GlobalConsts.userApi}/user/id`).subscribe((user) => {this.user = user});
		
		console.log('TODEBUG', this.user);
	}

	modifyUsername() {
		// Subscription to get the updated username

		// this.userPreference.changeUsername(username);
		console.log(this.user.name);
	}
}
