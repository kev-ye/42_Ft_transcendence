import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { LocalUser } from '../common/user';
import { GlobalConsts } from '../common/global';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {
	title: string = GlobalConsts.siteTitle;
  user: LocalUser = {
		name: '',
    avatar: '',
    fortyTwoAvatar: ''
  };
	subscriptionForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^[a-zA-Z ]*$')
    ])
  });

	constructor(
		private router: Router,
		private userApi: UserApiService) { }

  ngOnInit(): void {
		this.userApi.getUserById()
      .then(res => {
        if (res && res.name !== '')
          this.router.navigate(['main']);
      });
  }

  createUser() {
    this.userApi.createUser(this.subscriptionForm.value.name)
      .then(param => {
        if (param.name === this.subscriptionForm.value.name)
          this.router.navigate(['main']);
      })
			.catch(_ => {
				this.router.navigate(['user_login']);
			})
  }
}
