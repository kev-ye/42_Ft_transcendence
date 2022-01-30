import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('canActive', route);

      console.log('Item:', window.localStorage.getItem('userId'));
      const isLogin = window.localStorage.getItem('userId') ? true : false;
      if (!isLogin) {
        console.log('login');
        this.router.navigate(['user_login']);
      }
      return true;
  }
  
}
