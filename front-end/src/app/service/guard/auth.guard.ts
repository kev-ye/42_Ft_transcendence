import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';
import { LocalUser } from 'src/app/common/user';

import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const user: LocalUser = await this.userApi.getUserById();

      // console.log('auth user:', user);

			if (user)
				return true;

			this.router.navigate(['user_login']);
      return false;
  }
}
