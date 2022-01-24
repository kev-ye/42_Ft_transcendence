import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User42ApiService } from '../service/user42_api/user42-api.service';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {

  code?: any;

  constructor(
    private route: ActivatedRoute,
    private user42ApiService: User42ApiService) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.code = params;
        if (this.code.code)
        {
          console.log(this.code.code); // price
          this.get_token(this.code.code);
        }
        else
        {
          console.log('error');
        }
      });
  }

  get_token(code: string) {
    this.user42ApiService.get_token(code)
    .subscribe((result) => {
      console.log(result);
    });
  }
}
