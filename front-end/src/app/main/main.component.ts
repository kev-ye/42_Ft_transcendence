import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subscribable, Subscriber, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserApiService } from '../service/user_api/user-api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

  ngOnInit(): void {
    const isLogin = window.localStorage.getItem('userId');
  
    if (!isLogin) {
      this.router.navigate(['user_login']);
      return ;
    }

    this.userApi.getUserById(isLogin)
      .then(res => {
        if (res && res.name === '')
          this.router.navigate(['user_subscription']);
      });
  }
}
