import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GlobalConsts } from './common/global';
import { Router } from "@angular/router";

import { interval, switchMap, of, Subscription, Observable } from 'rxjs';

import { UserAuthService } from "./service/user_auth/user-auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = GlobalConsts.siteTitle;
	time: number = 60 * 60 * 1000; // one hour
	user: any = null;

	private subscription?: Subscription;
	intervalObs: Observable<number> = interval(this.time);

	constructor(
		private router: Router,
		private userAuth: UserAuthService) {}

	ngOnInit() {
		this.subscription = this.intervalObs
			.pipe(
				switchMap(() => {
					if (this.router.url !== '/user_login')
						return this.userAuth.connexionRefresh();
					return of(null);
				})
			)
			.subscribe()
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	@HostListener('window:beforeunload')
	beforeExitWindow(): boolean {
		if (this.router.url !== '/user_login')
			return navigator.sendBeacon(`${GlobalConsts.userApi}/user/auth/logout`);
		return true;
	}
}
