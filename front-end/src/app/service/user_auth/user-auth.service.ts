import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, throwError, of, lastValueFrom  } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class UserAuthService {

	constructor(
		private httpClient: HttpClient,
		private activeRoute: ActivatedRoute,
		private router: Router,
		private userApi: UserApiService,
		private cookieService: CookieService) {}
	
/* public function */

	public ftAuthLogin() {
		const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
		const client_id: string = 'fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
		const redirect_uri: string = 'http://localhost:3000/user/42/auth/callback';
		const response_type: string = 'code';
		const scope: string = 'public';

		window.location.href = `${URL_42_LOGIN}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
	}

	public ftAuthLogout() {
		return lastValueFrom(this.httpClient.delete('http://localhost:3000/user/42/auth/logout', {
			withCredentials: true
		}));
	}
}
