import { Component, OnInit } from '@angular/core';

import { UserAuthService } from '../service/user_auth/user-auth.service';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private readonly userAuthService: UserAuthService) {}

  ngOnInit(): void {
    this.userAuthService.ftAuthValider()
      .subscribe(param => { console.log('param:', param) })
  }
  
}
