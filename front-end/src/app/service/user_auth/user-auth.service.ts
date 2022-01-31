import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, throwError, of, lastValueFrom  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class UserAuthService {

  constructor(
    private httpClient: HttpClient,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private userApi: UserApiService) {}
  
/* public function */

  public ftAuthLogin() {
    const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
    const client_id: string = 'client_id=fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
    const redirect_uri: string = 'redirect_uri=http://localhost:4200/callback';
    const response_type: string = 'response_type=code';
    const scope: string = 'scope=public';

    window.location.href = `${URL_42_LOGIN}?${client_id}&${redirect_uri}&${response_type}&${scope}`;
  }

  public async ftAuthValider(): Promise<any> {
    let code_query: any = undefined;
    const url_api: string = 'http://localhost:3000';

    const toUnsub = this.activeRoute.queryParams
      .subscribe(params => { code_query = params; });

    const url_api_callback: string = `${url_api}/user/auth/42/callback?code=${code_query.code}`;

    toUnsub.unsubscribe();
    return this._tryAuth(url_api_callback)
      .then((param) => {
        console.log('param:', param);
        window.localStorage.setItem('userId', param.id);
      })
      .catch(this._handleError);
  }

  public exit(): void {
    window.localStorage.removeItem('userId');
  }

/* private function */

  private async _tryAuth(url: string) : Promise<any> {
    const ret$ = this.httpClient.post(url, null)
      .pipe(
        tap(_ => { console.log('User connected') }),
        catchError(this._handleError))
    return lastValueFrom(ret$);
  }

  private _handleError = (error: HttpErrorResponse) => {
    if (error.status === 0)
      console.error('An error occurred:', error.error);
    else
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    this.router.navigate(['user_login']);
    return throwError('Something bad happened; please try again later.');
  }

}
