import {Component, HostListener, OnDestroy} from '@angular/core';
import { GlobalConsts } from './common/global';
import {UserApiService} from "./service/user_api/user-api.service";
import {lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title: string = GlobalConsts.siteTitle;

	// constructor(
	// 	private userApi: UserApiService,
	// 	private http: HttpClient) {
	// }

	// @HostListener('window:beforeunload', ['$event'])
	async ngOnDestroy() {
	// 	console.log('here');
	// 	this.http.get(`${GlobalConsts.userApi}/user/test`).subscribe();
	}
	//
	// @HostListener('window:unload', ['$event'])
	// nothing() {
	//
	// }
}
