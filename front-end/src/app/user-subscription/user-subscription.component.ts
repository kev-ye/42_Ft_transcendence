import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../service/user_api/user';


@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {

  user: User = {
    id: '',
    name: ''
  };
  name?: string;

  subscriptionForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
      Validators.pattern('^[a-zA-Z ]*$')
    ])
  });

  ngOnInit(): void {
    console.log('before:', window.localStorage.getItem('userId'));
    window.localStorage.removeItem('userId');
    console.log('after:', window.localStorage.getItem('userId'));
  }

  // createUser(f: any) {
  //   this.userApiService.createUser(f.value)
  //     .subscribe((result) => {
  //       console.log(result);
  //     });
  // }

}
