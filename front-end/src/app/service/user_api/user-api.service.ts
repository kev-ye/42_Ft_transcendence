import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable } from 'rxjs';

import { LocalUser } from '../../common/user';
import { GlobalConsts } from 'src/app/common/global';


@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API: string = GlobalConsts.userApi;

  constructor(private httpClient: HttpClient) {}

/*
 * User Api
 */

  async getUserById(): Promise<LocalUser> {
    return lastValueFrom(this.httpClient.get(`${this.USER_API}/user/id`, {
			withCredentials: true
		}))
		.then(res => res as LocalUser)
		.catch(UserApiService._handleError);
  }

  async createUser(name: any): Promise<any> {
    return lastValueFrom(this.httpClient.put(`${this.USER_API}/user/create/first`, { name: name}, {
			withCredentials: true
		}))
		.catch(UserApiService._handleError);
  }

	getUser(): Observable<any> {
    return this.httpClient.get(`${this.USER_API}/user/id`, {
			withCredentials: true
		});
  }

	twoFaGenerate(): Observable<any> {
		return this.httpClient.post<any>(`${this.USER_API}/user/auth/2fa/generate`, {}, {
			withCredentials: true
		})
	}

	twoFaVerify(token: any): Observable<any> {
		return this.httpClient.post<any>(`${GlobalConsts.userApi}/user/auth/2fa/verify`, token, {
			withCredentials: true
		})
	}

	twoFaTurnOff():  Observable<any> {
		return this.httpClient.delete<any>(`${this.USER_API}/user/auth/2fa/turnoff`, {
			withCredentials: true
		})
	}

/*
 * private function
 */

  private static _handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
		// this.router.navigate(['user_login']);
    return Promise.reject(error.message || error);
  }
}
