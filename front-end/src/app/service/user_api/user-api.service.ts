import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../../common/user';
import { LocalUser } from '../../common/user';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API: string = 'http://localhost:3000/user'

  constructor(private httpClient: HttpClient) {}

/* public function */

  public async getUserById(): Promise<LocalUser> {
    return lastValueFrom(this.httpClient.get(`${this.USER_API}/id`, {
			withCredentials: true
		}))
		.then(res => res as LocalUser)
		.catch(this._handleError);
  }

  public async createUser(name: any): Promise<any> {
    const ret = this.httpClient.put(`${this.USER_API}/update`, name)
    return lastValueFrom(ret)
      .catch(this._handleError);
  }

/* private function */

  private _handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
