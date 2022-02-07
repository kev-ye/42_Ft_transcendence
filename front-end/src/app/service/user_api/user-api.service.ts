import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { LocalUser } from '../../common/user';
import { GlobalConsts } from 'src/app/common/global';


@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API: string = GlobalConsts.userApi;

  constructor(private httpClient: HttpClient) {}

/* public function */

  public async getUserById(): Promise<LocalUser> {
    return lastValueFrom(this.httpClient.get(`${this.USER_API}/user/id`, {
			withCredentials: true
		}))
		.then(res => res as LocalUser)
		.catch(this._handleError);
  }

  public async createUser(name: any): Promise<any> {
    return lastValueFrom(this.httpClient.put(`${this.USER_API}/user/create/first`, { name: name}, {
			withCredentials: true
		}))
		.catch(this._handleError);
  }

/* private function */

  private _handleError(error: any): Promise<any> {
    console.error('An error occurred', error);

    return Promise.reject(error.message || error);
  }
}
