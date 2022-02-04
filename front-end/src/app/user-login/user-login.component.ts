import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { UserApiService } from '../service/user_api/user-api.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  title: string = GlobalConsts.siteTitle;
  icon: string = "login";
  buttonMsg: string = "Login with 42";

  constructor(
		private readonly userAuth: UserAuthService,
		private readonly userApi: UserApiService,
		private router: Router) {}

  ngOnInit() {
		this.userApi.getUserById()
      .then(_ => {
          this.router.navigate(['main']);
      });
	}

  ftLogin() {
    this.userAuth.ftAuthLogin();
  }
}
