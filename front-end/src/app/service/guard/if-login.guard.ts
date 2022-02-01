import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class IfLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLogin = window.localStorage.getItem('userId');

      if (!isLogin)
        return true;

      return this.userApi.getUserById(isLogin)
        .then(res => {
          if (res.id && res.id === isLogin) {
            this.router.navigate(['main']);
            return false;
          }
          else
            return true;
        })
  }
}
