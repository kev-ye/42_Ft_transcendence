import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { LocalUser } from 'src/app/common/user';
import { UserApiService } from '../user_api/user-api.service';

@Injectable({ providedIn: 'root' })
export class IfLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

		async canActivate(
			route: ActivatedRouteSnapshot,
			state: RouterStateSnapshot): Promise<boolean> {
				const user: LocalUser = await this.userApi.getUserById();
	
				// console.log('if-login user:', user);
	
				if (user) {
					this.router.navigate(['main']);
					return false;
				}
	
				return true;
		}
}
