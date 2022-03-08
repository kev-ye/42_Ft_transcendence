import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalConsts } from '../common/global';
import {DataSharedService} from "../service/data/data-shared.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = GlobalConsts.siteTitle;

	constructor(private data: DataSharedService) {}

	ngOnInit() {
		Promise.resolve(null).then(() => this.data.changeIsLoginData(true));
	}
}
