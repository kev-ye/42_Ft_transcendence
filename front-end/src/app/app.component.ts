import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { GlobalConsts } from './common/global';
import { Router } from "@angular/router";

import {interval, map, Observable, Subscription} from 'rxjs';
import {UserApiService} from "./service/user_api/user-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = GlobalConsts.siteTitle;
	time: number = 60 * 60 * 1000; // one hour
	user: any = null;

	intervalSub?: Subscription;
	userRefreshSub?: Subscription;

	constructor(
		private router: Router,
		private userApi: UserApiService) {}

	ngOnInit() {
		this.intervalSub = interval(this.time).subscribe( () => {
			if (this.router.url !== '/user_login')
				this.userRefreshSub = this.userApi.test().subscribe();
		})
	}

	ngOnDestroy() {
		this.intervalSub?.unsubscribe();
		this.userRefreshSub?.unsubscribe();
	}

	@HostListener('window:beforeunload')
	beforeExitWindow(): boolean {
		if (this.router.url !== '/user_login')
			return navigator.sendBeacon(`${GlobalConsts.userApi}/user/auth/logout`);
		return true;
	}
}
