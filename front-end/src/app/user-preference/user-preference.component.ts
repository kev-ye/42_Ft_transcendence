import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
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

	constructor( private userPreference: UserPreferenceService ) {

	}

	ngOnInit(): void {

	}

	modifyUsername() {
		console.log('modifyUsername');
	}
}
