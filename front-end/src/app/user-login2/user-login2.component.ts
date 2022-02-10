import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { UserApiService } from '../service/user_api/user-api.service';

@Component({
  selector: 'app-user-login2',
  templateUrl: './user-login2.component.html',
  styleUrls: ['./user-login2.component.css']
})
export class UserLogin2Component implements OnInit {

	title: string = GlobalConsts.siteTitle;
  icon: string = "login";
  buttonMsg: string = "Login with Google";

  constructor(
		private readonly userAuth: UserAuthService,
		private readonly userApi: UserApiService,
		private router: Router) {}

  ngOnInit(): void {}

	ftLogin() {
    this.userAuth.ftAuthLogin();
  }

}
