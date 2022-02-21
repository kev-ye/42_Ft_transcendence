import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { GlobalConsts } from 'src/app/common/global';


@Injectable({ providedIn: 'root' })
export class UserApiService {
  USER_API: string = GlobalConsts.userApi;

  constructor(private httpClient: HttpClient) {}

/*
 * User Api
 */

	createUser(name: any): Observable<any> {
    return this.httpClient.put(`${this.USER_API}/user/create/first`, { name: name}, {
			withCredentials: true
		})
  }

	getUser(): Observable<any> {
    return this.httpClient.get<any>(`${this.USER_API}/user/id`, {
			withCredentials: true
		})
  }
}
