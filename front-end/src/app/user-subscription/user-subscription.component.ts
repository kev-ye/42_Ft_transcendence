import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { GlobalConsts } from '../common/global';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit, OnDestroy {
	title: string = GlobalConsts.siteTitle;

	subscriptionForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^[a-zA-Z ]*$')
    ])
  });

	private subscription?: Subscription;

	constructor(
		private router: Router,
		private userApi: UserApiService) { }

  ngOnInit(): void {}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	createUser() {
		const confirm$: boolean = confirm(`Create account with name: ${this.subscriptionForm.value.name} ?`)
		if (confirm$)
			this.subscription = this.userApi.createUser(this.subscriptionForm.value.name).subscribe({
				next: (v) => {
					console.log('name:', this.subscriptionForm.value.name);
					if (v.name === this.subscriptionForm.value.name)
						this.router.navigate(['main']).then();
					else
						alert('something wrong, try again!');
				},
				error: (e) => {
					console.error('Error: create user:', e);
					this.router.navigate(['user_login']).then();
				},
				complete: () => console.info('Complete: create user done')
			});
  }
}
