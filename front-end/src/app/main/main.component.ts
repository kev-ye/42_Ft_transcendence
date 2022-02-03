import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { LocalUser } from '../common/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = GlobalConsts.siteTitle;

  constructor(
    private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService) { }

  ngOnInit() {
    this.userApi.getUserById()
      .then(res => {
        if (res && res.name === '')
          this.router.navigate(['user_subscription']);
      });
  }

  logOut(): void {
		this.userAuth.ftAuthLogout();
		window.location.reload();
	}
}
