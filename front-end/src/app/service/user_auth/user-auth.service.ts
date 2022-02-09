import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, throwError, of, lastValueFrom  } from 'rxjs';

import { UserApiService } from '../user_api/user-api.service';
import { GlobalConsts } from 'src/app/common/global';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
	USER_API: string = GlobalConsts.userApi;

	constructor(private httpClient: HttpClient) {}

	ftAuthLogin() {
		const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
		const client_id: string = 'dff6b306ea79df3603c349d11e8ba9de3595ba4ebddc08321158cb53c40bc847';
		const redirect_uri: string = `${this.USER_API}/user/42/auth/callback`;
		const response_type: string = 'code';
		const scope: string = 'public';

		window.location.href = `${URL_42_LOGIN}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
	}

	ftAuthLogout() {
		return this.httpClient.delete<void>(`${this.USER_API}/user/42/auth/logout`, {
			withCredentials: true
		});
	}
}
