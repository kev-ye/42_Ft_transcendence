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

	updateUsername(id: string, username : string) : boolean {
		this.http.put(`${GlobalConsts.userApi}/user/update`, {id: id, name: username})
		.subscribe({
			next: (data) => {
				console.log('success', data);
				return true;
			},
			error: (data) => {
				console.log('error', data);
			}
		});
		return false;
	}
}
