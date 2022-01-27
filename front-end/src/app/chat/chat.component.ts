import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

  friendRequests: any[] = [{username: "wartek"}, {username: "diablox9"}]

  ngOnInit(): void {
  }

}
