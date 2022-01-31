import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from './service/user_auth/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'ft_transcendence - Pong';

  constructor(
    private readonly userAuth: UserAuthService,
    private router: Router) {}

  public exit(): void {
    this.userAuth.exit();
    this.router.navigate(['user_login']);
  }
}
