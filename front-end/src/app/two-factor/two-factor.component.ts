import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';

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
	twoFaActive: boolean = false;
	img: string = '';
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
					if (v.twoFactorSecret) {
						console.log('twoFa:', this.twoFaActive);
						this.twoFaActive = true;
					}
					else
						this._generateNewTF();
				},
				error: (e) => console.log('Init error:', e),
				complete: () => console.log('Init done')
			});
  }

	turnOff(): void {
		this.userApi.twoFaTurnOff()
			.subscribe({
				next: (v) => {
					this.twoFaActive = false;
				},
				error: (e) => console.log('Turn off error:', e),
				complete: () => console.log('Turn off done')
			});
	}

	verif(): void {
		this.userApi.twoFaVerif(this.twoFactorForm.value)
			.subscribe({
				next: (v) => {
					if (v.delta === 0)
						this.router.navigate(['main']);
					else
						window.alert((v.delta === -1)? 'Your token has expired' : 'Your Token is invalid');
				},
				error: (e) => console.log('Verif error:', e),
				complete: () => console.log('Verif done')
			});
	}

/*
 * Private function
 */

	private _generateNewTF() {
		this.userApi.twoFaGenerate()
			.subscribe({
				next: (v) => {
					console.log('info:', v);
					this.img = v.qr;
				},
				error: (e) => console.log('Generate error:', e),
				complete: () => console.log('Generate done')
			});
	}

}
