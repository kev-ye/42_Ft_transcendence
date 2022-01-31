import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  showChat: boolean = false;
  messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "coucou les gamers comment allez-vous en ce jour assez incroyable ?"},{id: 1, username: "wartek", message: "xxxxx"}];
  //messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "coucou les gamers comment allez-vous en ce jour assez incroyable ?"}];

  friendRequests: any[] = [{username: "wartek"}, {username: "diablox9"}]
  focus: string = "";
  channelList: any[] = [{id: 1, name: "les Boss", access: 0}, {id: 2, name: "Coucou", access: 1}]

  ngOnInit(): void {
  }

  openFriendChat(friend: any) {
    console.log("Opening chat with ", friend);
    if (!this.showChat)
      this.showChat = true;
    else
      this.showChat = false;
  }

  openChannel(channel: any) {
    if (channel.access == 2)
      return ;
    else if (channel.access == 1)
    {

      this.dialog.open(DialogProtectedChat, {
        data: {
          wesh: "bite"
        }
      });
      return;
    }
      if (!this.showChat)
      this.showChat = true;
    else
      this.showChat = false;
  }

  focusFriend(username: string) {
    this.focus = username;
  }

  unfocusFriend() {
    this.focus = "";
  }

  openFriendList(event: any) {
    this.showChat = false;
    console.log("salut", event);
    
  }

  openUserDialog(username: string) {
    this.dialog.open(DialogUser, {
      data: {
        username: username,
      }
    })
  }

}

@Component({
  selector: "dialog-protected-chat",
  templateUrl: "./dialog-protected-chat.html"
})
export class DialogProtectedChat implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
      console.log(this.data);
      
  }
}

@Component({
  selector: "dialog-user",
  templateUrl: "./dialog-user.html"
})
export class DialogUser {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.username = data.username;
  }

  username: string = "";
}
