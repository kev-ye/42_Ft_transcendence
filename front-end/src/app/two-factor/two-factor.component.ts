import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';

import { GlobalConsts } from '../common/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit {
	img: string = '';
	twoFactorForm: FormGroup = new FormGroup({
		token: new FormControl('', [
			Validators.required,
			Validators.pattern('^[0-9]*$')
		])
	})

  constructor(
		private httpClient: HttpClient,
		private router: Router) { }

  ngOnInit(): void {
		this.httpClient.post<any>(`${GlobalConsts.userApi}/user/auth/2fa/generate`, {}, {
			withCredentials: true
		}).subscribe(info => {
			console.log('test:', info);
			this.img = info.qr;
		});
  }

	turnOff(): void {
		this.httpClient.delete<any>(`${GlobalConsts.userApi}/user/auth/2fa/turnoff`, {
			withCredentials: true
		}).subscribe(_ => {});
	}

	verif(): void {
		console.log('input:', this.twoFactorForm.value);
		this.httpClient.post<any>(`${GlobalConsts.userApi}/user/auth/2fa/verif`, this.twoFactorForm.value, {
			withCredentials: true
		}).subscribe(result => {
			if (result.delta === 0)
				this.router.navigate(['main']);
			else
				window.alert((result.delta === -1)? 'Your token has expired' : 'Your Token is invalid');
		});
	}

}
