import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = GlobalConsts.siteTitle;
	/* NOTE: all subscribe need unsub in ngDestroy for no leak!!!! */

	/// attribute prepared for tfa
	twoFaActive: boolean = false;
	qrCode: string = '';
	///

  constructor(
    private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService) { }

  ngOnInit() {
		this.userApi.getUser()
			.subscribe({
				next: (v) => {
					if (v && v.name === '')
						this.router.navigate(['user_subscription']).then();
					/// later move too parameter -> 'else' part
					else {
						if (v.twoFactorSecret) {
							this.twoFaActive = true;
							this.qrCode = v.twoFactorQR;
							if (v.online === 0)
								this.router.navigate(['two_factor']).then();
						}
					}
				},
				error: (e) => console.error('init error:', e),
				complete: () => console.info('init complete')
			})
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
