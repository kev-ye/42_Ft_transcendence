import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserApiService } from '../service/user_api/user-api.service';
import { LocalUser } from '../service/user_api/user';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {
  constructor(
    private router: Router,
    private userApi: UserApiService) { }

  user: LocalUser = {
    name: '',
    avatar: '',
    fortyTwoAvatar: ''
  };

  ngOnInit(): void {
    const isLogin = window.localStorage.getItem('userId');
  
    if (!isLogin) {
      this.router.navigate(['user_login']);
      return ;
    }

    this.userApi.getUserById(isLogin)
      .then(res => {
        if (res.name !== '')
          this.router.navigate(['main']);
      });
  }

  subscriptionForm: FormGroup = new FormGroup({
    id: new FormControl(window.localStorage.getItem('userId')),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
      Validators.pattern('^[a-zA-Z ]*$')
    ])
  });

  createUser() {
    console.log('create:', this.subscriptionForm.value);
    this.userApi.createUser(this.subscriptionForm.value)
      .then(param => {
        if (param.name === this.subscriptionForm.value.name)
          this.router.navigate(['main']);
      })
  }
}
