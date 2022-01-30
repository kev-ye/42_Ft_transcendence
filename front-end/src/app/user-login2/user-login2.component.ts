import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-login2',
  templateUrl: './user-login2.component.html',
  styleUrls: ['./user-login2.component.css']
})
export class UserLogin2Component implements OnInit {

  icon: string = "login";
  buttonMsg: string = "Login with Google";

  constructor() { }

  ngOnInit(): void {
    window.localStorage.removeItem('userId');
    console.log('after remove', window.localStorage.getItem('userId'));
  }

}
