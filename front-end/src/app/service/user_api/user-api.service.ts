import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  USER_API_SERVER: string = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  public readUser(){
    return this.httpClient.get<User[]>(`${this.USER_API_SERVER}/users`);
  }

  public createUser(users: any){
    return this.httpClient.post<User>(`${this.USER_API_SERVER}/users/create`, users);
  }
}
