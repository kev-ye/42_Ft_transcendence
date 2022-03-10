import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PlatformLocation } from "@angular/common";
import { GlobalConsts } from './common/global';
import { Router } from '@angular/router';

import { interval, switchMap, of, Subscription, Observable } from 'rxjs';

import { UserAuthService } from "./service/user_auth/user-auth.service";
import { MatSidenav } from "@angular/material/sidenav";
import { UserApiService } from "./service/user_api/user-api.service";
import { DataSharedService } from "./service/data/data-shared.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
	title: string = GlobalConsts.siteTitle;
	time: number = 60 * 60 * 1000;
	isLogin: boolean = false;
	inRoom: boolean = false;

	private subscription: Subscription = new Subscription();
	intervalObs: Observable<number> = interval(this.time);

	constructor(
		private router: Router,
		private location: PlatformLocation,
		private userAuth: UserAuthService,
		private userApi: UserApiService,
		private data: DataSharedService
	) {
		this.location.onPopState(() => {
			if (this.isLogin) {
				window.alert("You are logout");
				this._logOut();
			}
		});
	}

	ngOnInit() {
		this.subscription.add(this.data.isLoginData.subscribe(data => this.isLogin = data));
		this.subscription.add(this.intervalObs
			.pipe(
				switchMap(() => {
					if (this.isLogin)
						return this.userAuth.connexionRefresh();
					return of(null);
				})
			)
			.subscribe());
	}

	ngOnDestroy() {
		console.log('!!!!app destroy!!!');
		this.subscription?.unsubscribe();
	}

	@HostListener('window:beforeunload')
	beforeExitWindow(): boolean {
		if (this.router.url !== '/user_login') {
			navigator.sendBeacon(`${GlobalConsts.userApi}/user/auth/logout`);
			this.router.navigate(['user_login']).then();
		}
		return true;
	}

	receiveClose($event: boolean, userSideNav: MatSidenav, chatSideNav: MatSidenav) {
		if ($event) {
			userSideNav.close().then();
			chatSideNav.close().then();
		}
	}

	roomActive() {
		this.inRoom = !this.inRoom;
		if (this.inRoom)
				this.router.navigate(['game_room']).then();
		else {
			const result: boolean = confirm('Leave room?');
			if (result)
				this.router.navigate(['main']).then();
			else
				this.inRoom = true;
		}
	}

	joinGame(id: string) {
		this.router.navigate(['game'], {queryParams: {id: id}}).then()
	}

/*
 private
 */
	private _logOut() {
		this.subscription.add(this.userAuth.logout().subscribe({
			next: _ => {
				this.data.changeIsLoginData(false);
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
