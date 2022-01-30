import { Component, OnInit } from '@angular/core';

import { UserAuthService } from '../service/user_auth/user-auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  icon: string = "login";
  buttonMsg: string = "Login with 42";

  constructor(private readonly userAuthService: UserAuthService) {}

  ngOnInit() {}

  ftLogin() {
    this.userAuthService.ftAuthLogin();
  }
}
