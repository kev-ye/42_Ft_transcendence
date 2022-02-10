import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, throwError, of, lastValueFrom, last  } from 'rxjs';

import { UserApiService } from '../user_api/user-api.service';
import { GlobalConsts } from 'src/app/common/global';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
	USER_API: string = GlobalConsts.userApi;

	constructor(private httpClient: HttpClient) {}

	ftAuthLogin() {
		// const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
		// const client_id: string = 'fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
		// const redirect_uri: string = `${this.USER_API}/user/auth/42/callback`;
		// const response_type: string = 'code';
		// const scope: string = 'public';

		// window.location.href = `${URL_42_LOGIN}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
		window.location.href = `${this.USER_API}/user/auth/42/login`;
	}

	googleAuthLogin() {
		window.location.href = `${this.USER_API}/user/auth/google/login`;
	}

	ftAuthLogout() {
		return this.httpClient.delete<void>(`${this.USER_API}/user/auth/logout`, {
			withCredentials: true
		});
	}
}
