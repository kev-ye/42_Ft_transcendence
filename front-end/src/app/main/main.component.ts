import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  title: string = GlobalConsts.siteTitle;

	twoFaActive: boolean = false;
	qrCode: string = '';

	/*
	 * NOTE: all subscribe need unsub in ngDestroy for no leak!!!!
	 * But we don't need unsub all of httpClient
	*/
	private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService) { }

  ngOnInit() {
		this.subscription.add(this.userApi.getUser().subscribe({
			next: (v) => {
				if (v.twoFactorSecret) {
					this.twoFaActive = true;
					this.qrCode = v.twoFactorQR;
				}
			},
			error: (e) => console.error('Error: get user in main:', e),
			complete: () => console.info('Complete: get user in main')
		}))
  }

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	logOut(): void {
		const confirm$: boolean = confirm('Are you sure?');
		if (confirm$) {
			this.subscription.add(this.userAuth.logout().subscribe({
				next: _ => {
					this.router.navigate(['user_login']).then();
				},
				error: e => {
					console.error('Error: user logout:', e);
					this.router.navigate(['user_login']).then();
				},
				complete: () => console.info('Complete: user logout done')
			}));
		}
	}

	//// test function prepared for parameter
	turnOnTwoFa() {
		this.subscription.add(this.userAuth.twoFaGenerate().subscribe({
			next: (v) => {
				console.log('info:', v);
				this.qrCode = v.qr;
				this.twoFaActive = true;
			},
			error: (e) => {
				console.error('Error: two-fa generate:', e);
				alert('Something wrong, try again!');
			},
			complete: () => console.info('Complete: two-fa generate done')
		}));
	}

  turnOffTwoFa() {
		this.subscription.add(this.userAuth.twoFaTurnOff().subscribe({
			next: _ => {
				this.qrCode = '';
				this.twoFaActive = false;
			},
			error: (e) => {
				console.error('Error: two-fa: turn off:', e);
				alert('Something wrong, try again!');
			},
			complete: () => console.info('Complete: two-fa turn off done')
		}));
  }
}
