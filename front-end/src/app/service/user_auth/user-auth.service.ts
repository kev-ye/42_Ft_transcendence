import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, throwError, of  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  user: any = undefined;

  constructor(
    private httpClient: HttpClient,
    private activeRoute: ActivatedRoute,
    private router: Router) {}
  
/* public function */

  public ftAuthLogin() {
    const URL_42_LOGIN: string = 'https://api.intra.42.fr/oauth/authorize';
    const client_id: string = 'client_id=fe43617a69dd01349a0721bdc45a4540c047eae07652b71c69a5cb8d9ebb8d62';
    const redirect_uri: string = 'redirect_uri=http://localhost:4200/callback';
    const response_type: string = 'response_type=code';
    const scope: string = 'scope=public';

    window.location.href = `${URL_42_LOGIN}?${client_id}&${redirect_uri}&${response_type}&${scope}`;
  }

  public ftAuthValider(): Observable<any> {
    let code_query: any = undefined;
    const url_api: string = 'http://localhost:3000';

    const toUnsub = this.activeRoute.queryParams
      .subscribe(params => { code_query = params; });

    const url_api_callback: string = `${url_api}/user/auth/42/callback?code=${code_query.code}`;

    toUnsub.unsubscribe();
    return this._tryAuth(url_api_callback);
  }

  // comment:
  // last time:
  // create user service (to do) -> to check user stat .. and other thing
  // callback page (to do) -> verif user stat and redirect to dependencie page

/* private function */

  private _tryAuth(url: string) : Observable<any> {
    return this.httpClient.get(url)
      .pipe(
        tap(_ => { console.log('User connected') }),
        catchError(this._handleError))
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
