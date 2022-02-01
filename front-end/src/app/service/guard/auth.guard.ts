import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';

import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLogin = window.localStorage.getItem('userId');

      // console.log('route:', route);

      if (!isLogin) {
        this.router.navigate(['user_login']);
        return false;
      }

      return this.userApi.getUserById(isLogin)
        .then(res => {
          if (res.id && res.id === isLogin)
            return true;
          else {
            this.router.navigate(['user_login']);
            return false;
          }
        })
  } 
}
