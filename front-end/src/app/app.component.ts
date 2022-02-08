import { Component} from '@angular/core';
import { GlobalConsts } from './common/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = GlobalConsts.siteTitle;
}
