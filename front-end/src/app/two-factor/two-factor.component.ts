import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GlobalConsts } from '../common/global';
import { Router } from '@angular/router';
import { UserApiService } from '../service/user_api/user-api.service';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit {
	title: string =  GlobalConsts.siteTitle;
	twoFactorForm: FormGroup = new FormGroup({
		token: new FormControl('', [
			Validators.required,
			Validators.pattern('^[0-9]*$')
		])
	})

  constructor(
		private router: Router,
		private userApi: UserApiService) { }

  ngOnInit(): void {
		this.userApi.getUser()
			.subscribe({
				next: (v) => {
					if (!v.twoFactorSecret)
						this.router.navigate(['main']).then();
				},
				error: (e) => {
					console.error('Init error:', e);
					this.router.navigate(['main']).then();
				},
				complete: () => console.info('Init done')
			});
  }

	verify(): void {
		this.userApi.twoFaVerify(this.twoFactorForm.value)
			.subscribe({
				next: (v) => {
					if (v.delta === 0)
						this.router.navigate(['main']).then(_ => {});
					else
						window.alert((v.delta === -1)? 'Your token has expired' : 'Your Token is invalid');
				},
				error: (e) => console.log('Verify error:', e),
				complete: () => console.log('Verify done')
			});
	}

}
