import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {

  URL_API: string = 'http://localhost:3000';
  code_query?: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.code_query = params;
        if (this.code_query.code)
          console.log(this.code_query.code);
        else
          console.log('error');
      });

    this.httpClient.get(`${this.URL_API}/user/auth/42/callback?code=${this.code_query.code}`)
      .subscribe((t) => {
        console.log('test:' , t);
      })
  }
}
