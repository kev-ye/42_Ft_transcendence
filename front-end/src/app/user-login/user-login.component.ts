import { Component, OnInit } from '@angular/core';

import { UserApiService } from '../service/user_api/user-api.service';
import { User42 } from '../user/user';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  icon: string = "login";
  buttonMsg: string = "Login with 42";

  constructor(private readonly userApiService: UserApiService) {}

  ngOnInit() {}

  ftLogin() {
    this.userApiService.ftAuthLogin();
  }
}
