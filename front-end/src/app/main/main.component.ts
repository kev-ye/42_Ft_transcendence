import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { Subscription, Observable } from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  title: string = GlobalConsts.siteTitle;
	/* NOTE: all subscribe need unsub in ngDestroy for no leak!!!! */

	/// attribute prepared for tfa
	userObs: Observable<any> = this.userApi.getUser();
	subscription?: Subscription;
	twoFaActive: boolean = false;
	qrCode: string = '';
	///

  constructor(
    private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService) { }

  ngOnInit() {
		this.subscription = this.userObs.subscribe({
			next: (v) => {
				if (v.twoFactorSecret) {
					this.twoFaActive = true;
					this.qrCode = v.twoFactorQR;
				}
			},
			error: (e) => console.error('init error:', e),
			complete: () => console.info('init complete')
		})
  }

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	logOut(): void {
		const confirm$: boolean = confirm('Are you sure?');
		if (confirm$) {
			this.userAuth.ftAuthLogout()
				.subscribe({
					next: _ => {
						this.router.navigate(['user_login']).then();
					},
					error: _ => {
						this.router.navigate(['user_login']).then();
					},
					complete: () => console.info('user logout')
				})
		}
	}

	//// test function prepared for parameter
	turnOnTwoFa() {
		this.userApi.twoFaGenerate()
			.subscribe({
				next: (v) => {
					console.log('info:', v);
					this.qrCode = v.qr;
					this.twoFaActive = true;
				},
				error: (e) => console.error('Generate error:', e),
				complete: () => console.info('Generate done')
			});
		// this.router.navigate(['two_factor']).then();
	}

  turnOffTwoFa() {
		this.userApi.twoFaTurnOff()
			.subscribe({
				next: _ => {
					this.qrCode = '';
					this.twoFaActive = false;
				},
				error: (e) => console.error('turn off error:', e),
				complete: () => console.info('two factor off done')
			})
  }

}
