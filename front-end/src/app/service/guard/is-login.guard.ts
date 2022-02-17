import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { UserApiService } from "../user_api/user-api.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

	canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
			return this.userApi.isLogin()
				.pipe(
					map(isLogin => {
						if (isLogin) return true;
						else {
							this.router.navigate(['user_login']).then();
							return false;
						}
					}),
					catchError(_ => {
						this.router.navigate(['user_login']).then();
						return of(false);
					})
				)
  }
}
