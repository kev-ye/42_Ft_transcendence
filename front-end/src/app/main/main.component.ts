import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('chat', [
      state('*', style({left: "0%"})),
      state('void', style({left: "-100%"})),
      transition('void <=> *', [
        animate('500ms ease-in-out')
      ])
    ]),
    trigger('user', [
      state('*', style({right: "0%"})),
      state('void', style({right: "-100%"})),
      transition("void <=> *", [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {
  title: string = GlobalConsts.siteTitle;
  
  chatVisibility: boolean = true;
  userVisibility: boolean = true;
  twoFaActive: boolean = false;
  qrCode: string = '';
  
  /*
  * NOTE: all subscribe need unsub in ngDestroy for no leak!!!!
  * But we don't need unsub all of httpClient
  */
  private subscription: Subscription = new Subscription();
  
  constructor(
    private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService,
    private http: HttpClient) { }    
    
    ngOnInit() {
      this.subscription.add(this.userApi.getUser().subscribe({
        next: (v) => {
          if (v.twoFactorSecret) {
            this.twoFaActive = true;
            this.qrCode = v.twoFactorQR;
          }
        },
        error: (e) => console.error('Error: get user in main:', e),
        complete: () => console.info('Complete: get user in main')
      }))
    }
    
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    
    logOut(): void {
      const confirm$: boolean = confirm('Are you sure?');
      if (confirm$) {
        this.subscription.add(this.userAuth.logout().subscribe({
          next: _ => {
            this.router.navigate(['user_login']).then();
          },
          error: e => {
            console.error('Error: user logout:', e);
            this.router.navigate(['user_login']).then();
          },
          complete: () => console.info('Complete: user logout done')
        }));
      }
    }

    openChat() {
      if (this.chatVisibility)
        this.chatVisibility = false;
      else
        this.chatVisibility = true;
  
    }
  
    openUser() {
      if (this.userVisibility)
        this.userVisibility = false;
      else
        this.userVisibility = true;
    }

    openLadder() {
      
    }
    
    //// test function prepared for parameter
    turnOnTwoFa() {
      this.subscription.add(this.userAuth.twoFaGenerate().subscribe({
        next: (v) => {
          console.log('info:', v);
          this.qrCode = v.qr;
          this.twoFaActive = true;
        },
        error: (e) => {
          console.error('Error: two-fa generate:', e);
          alert('Something wrong, try again!');
        },
        complete: () => console.info('Complete: two-fa generate done')
      }));
    }
    
    turnOffTwoFa() {
      this.subscription.add(this.userAuth.twoFaTurnOff().subscribe({
        next: _ => {
          this.qrCode = '';
          this.twoFaActive = false;
        },
        error: (e) => {
          console.error('Error: two-fa: turn off:', e);
          alert('Something wrong, try again!');
        },
        complete: () => console.info('Complete: two-fa turn off done')
      }));
    }
  }
  