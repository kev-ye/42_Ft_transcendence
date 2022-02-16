import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from '../service/user_api/user-api.service';
import { UserAuthService } from '../service/user_auth/user-auth.service';
import { GlobalConsts } from '../common/global';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

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

  constructor(private router: Router,
    private userApi: UserApiService,
    private userAuth: UserAuthService,
    private http: HttpClient) { }

    public socket: Socket;
    
    async ngOnInit() {
    this.socket = io('http://localhost:3002/', {withCredentials: true});

    
    this.http.get('http://localhost:3000/user/id', {withCredentials: true}).subscribe((data: any) => {
      
      //if (data.id)
      //this.socket.emit('user', {user_id: data.id});
    })
    
    
    
    this.userApi.getUserById()
    .then(res => {
      if (res && res.name === '')
      this.router.navigate(['user_subscription']);
      else
      {
        //console.log("test cookie ", );
        //this.socket.emit('session', )
      }
    });
    
  }

  ngOnDestroy(): void {
      this.socket.disconnect();
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
    this.router.navigate(["ladder"])
  }

  logOut(): void {
		this.userAuth.ftAuthLogout()
			.subscribe({
				next: (v) => {
					// console.log('Next:', v);
					this.router.navigate(['user_login']);
				},
				error: (e) => {
					// console.log('Error:', e);
					this.router.navigate(['user_login']);
				},
				complete: () => console.info('user logout')
			})
	}
}
