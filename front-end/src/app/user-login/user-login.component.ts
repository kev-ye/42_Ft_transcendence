import { Component, OnInit } from '@angular/core';

import { User42ApiService } from '../service/user42_api/user42-api.service';
import { User42 } from '../user/user';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  icon: string = "login";
  buttonMsg: string = "Login with 42";

  constructor(private user42ApiService: User42ApiService) {}

  ngOnInit() {
  }

  login_42() {
    this.user42ApiService.login_42();
  }
}
