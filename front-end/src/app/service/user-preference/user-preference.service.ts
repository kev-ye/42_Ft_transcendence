import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConsts } from '../../common/global';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

	private usernameVisibility : boolean = true;
	private subject = new Subject<any>();

	constructor(private http: HttpClient) { }

	triggerUsernameVisibility() : void {
		this.usernameVisibility = !this.usernameVisibility;
		return this.subject.next(this.usernameVisibility);
		// `${GlobalConsts.userApi}/`
	}
}
