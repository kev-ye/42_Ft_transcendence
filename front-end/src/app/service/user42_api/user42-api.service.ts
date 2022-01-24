import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

// import { User42 } from 'src/app/user/user';

@Injectable({
  providedIn: 'root'
})
export class User42ApiService {

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute) { }

  client_id: string = 'client_id=fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
  redirect_uri: string = 'redirect_uri=http://localhost:4200/callback';
  response_type: string = 'response_type=code';
  scope: string = 'scope=public';
  URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';

  login_42() {
    // window.open(`${this.URL_42_LOGIN}?${this.client_id}&${this.redirect_uri}&${this.response_type}&${this.scope}`);
    window.location.href = `${this.URL_42_LOGIN}?${this.client_id}&${this.redirect_uri}&${this.response_type}&${this.scope}`;
  }

  grant_type: string = 'grant_type=authorization_code';
  client_secret: string = 'client_secret=1c9aa5bd2286d287e667030165083668c66ccc4fe48b9f1a0940e213d9babef3';
  URL_42_TOKEN: string = 'https://api.intra.42.fr/oauth/token';

  get_token(code: string) {
    return this.httpClient.post<any>(`${this.URL_42_TOKEN}?${this.grant_type}&${this.client_id}&${this.client_secret}&code=${code}&${this.redirect_uri}`, null);
  }
}
