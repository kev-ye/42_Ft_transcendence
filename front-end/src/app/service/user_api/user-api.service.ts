import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/user/user';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  USER_API_SERVER: string = "http://localhost:3000";
  
  constructor(private httpClient: HttpClient) {}
  
  public ftAuthLogin() {

    const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
    const client_id: string = 'client_id=fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
    const redirect_uri: string = 'redirect_uri=http://localhost:4200/callback';
    const response_type: string = 'response_type=code';
    const scope: string = 'scope=public';

    window.location.href = `${URL_42_LOGIN}?${client_id}&${redirect_uri}&${response_type}&${scope}`;
  }

  public createUser(users: any) {
    return this.httpClient.post<User>(`${this.USER_API_SERVER}/users/create`, users);
  }
}
