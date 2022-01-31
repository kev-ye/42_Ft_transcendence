import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { User } from './user';
import { LocalUser } from './user';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API: string = 'http://localhost:3000/user'

  constructor(private httpClient: HttpClient) {}

/* public function */

  public async getUserById(id: string): Promise<User> {
    const ret = this.httpClient.get(`${this.USER_API}/id/${id}`)
    return lastValueFrom(ret)
      .then(res => res as User)
      .catch(this._handleError);
  }

  public async getLocalUserById(id: string): Promise<LocalUser> {
    const ret = this.httpClient.get(`${this.USER_API}/id/${id}`)
    return lastValueFrom(ret)
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
