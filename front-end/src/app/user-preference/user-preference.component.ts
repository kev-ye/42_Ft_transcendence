import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserPreferenceService } from '../service/user-preference/user-preference.service';

@Component({
  selector: 'app-user-preference',
  templateUrl: './user-preference.component.html',
  styleUrls: ['./user-preference.component.css']
})
export class UserPreferenceComponent implements OnInit {

	usernameVisibility : boolean = true;
	// subscribeToUsernameVisibility : Subscription;

	user : any = {
		name: 'besellem',
		avatar: 'https://cdn.intra.42.fr/users/ppoinsin.jpg',
		email: 'besellem@42.student.fr'
	};

	constructor( private userPreference: UserPreferenceService ) {
			// this.subscribeToUsernameVisibility = this.userPreference
			// .triggerUsernameVisibility()
			// .subscribe((value) => (this.usernameVisibility = value));
	}

	ngOnInit(): void {

	}

	triggerUsernameVisibility() {
		this.usernameVisibility = !this.usernameVisibility;
		console.log(this.usernameVisibility);
	}
}
