import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API: string = 'http://localhost:3000'

  constructor(private httpClient: HttpClient) {}

  public async getUserById(id: string): Promise<User> {
    const ret$ = this.httpClient.get(`${this.USER_API}/user/id/${id}`)
    return lastValueFrom(ret$)
      .then(res => res as User)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
