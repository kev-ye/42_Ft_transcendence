import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  icon: string = "login";
  buttonMsg: string = "Login with 42";

  constructor() { }

  ngOnInit(): void {
  }

}
