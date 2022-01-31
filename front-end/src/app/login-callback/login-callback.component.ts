import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from '../service/user_auth/user-auth.service';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private readonly userAuth: UserAuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.userAuth.ftAuthValider()
      .then(_ => this.router.navigate(['main']) );
  }
  
}
