import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { GlobalConsts } from './common/global';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = GlobalConsts.siteTitle;
	user: any = null;

	constructor(private router: Router) {}

	@HostListener('window:beforeunload')
	beforeExitWindow(): boolean {
		return this.router.url === '/user_login';
	}

	@HostListener('window:unload')
	exitWindow(): boolean {
		return navigator.sendBeacon(`${GlobalConsts.userApi}/user/auth/logout`);
	}
}
