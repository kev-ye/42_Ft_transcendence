import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConsts } from '../../common/global';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

	private usernameVisibility : boolean = true;

	constructor(private http: HttpClient) { }

	changeUsername(username : string) : any {
		this.http.get(`${GlobalConsts.userApi}/user/name/${username}`).subscribe({
			next: (user_id) => {
				console.log(user_id);
				// return this._changeUsername(user_id);
			}
		});
	}

	private _changeUsername(user_id : string) {
		return this.http.put(`${GlobalConsts.userApi}/user/update/${user_id}`, {})
			.subscribe({
				next: (user) => {return user}
			});
	}
}
