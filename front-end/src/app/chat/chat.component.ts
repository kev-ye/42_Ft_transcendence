import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  showChat: boolean = false;
  messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "xxxxx"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wagrtek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wardtek", message: "incroyable ?"}];
  //messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "coucou les gamers comment allez-vous en ce jour assez incroyable ?"}];

  friendRequests: any[] = [{username: "wartek"}, {username: "diablox9"}]
  focus: string = "";
  channelList: any[] = [{id: 1, name: "les Boss", access: 0, moderator: true}, {id: 2, name: "Coucou", access: 1, moderator: true}]
  chat: any = {name: "Chat-Name"};

  ngOnInit(): void {
  }

  test() {
    console.log("test");
    
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

  openFriendList(event?: any) {
    this.showChat = false;
    
    
  }

  openUserDialog(username: string) {
    this.dialog.open(DialogUser, {
      data: {
        username: username,
      }
    })
  }

  openSpec() {
    this.dialog.open(DialogSpectator, {
      data :
      {
        //channel name to send and moderator status
      }
    })
  }

  inviteFriend() {
    this.dialog.open(DialogInvite, {
      data: {
        //data
      }
    })
  }

  createChat() {
    //todo implement creating chat
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
  selector: "dialog-spec",
  templateUrl: "./dialog-spectator.html"
})
export class DialogSpectator implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogSpectator>, public dialog: MatDialog) {}

  ngOnInit(): void {
      console.log(this.data);
      
  }

  openUserProfile(username: string) {
    //this.dialogRef.close();
    
    const ref = this.dialog.open(DialogUser, {
      data: {
        username: username
      }
    });
    

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


@Component({
  selector: "dialog-invite",
  templateUrl: "./dialog-invite.html"
})
export class DialogInvite {
  inviteFriend(friend: string, channel: string) {
    //invite friend to channel
  }

}