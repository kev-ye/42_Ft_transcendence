import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  chat: {show: boolean, public: boolean, id: string, user_id: string, name: string} = {show: false, public: true, name: "", id: "", user_id: ""};
  messages: {id: string, username: string, user_id: string, type: number, message?: string}[] = [];
  
  scroll: boolean = false;
  //messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "xxxxx"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wagrtek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wardtek", message: "incroyable ?"}];
  
  friendList: any[] = [{username: "wartek", status: 0, id: "124"}, {username: "diablox9", status: 1, id: "145"}, {username: "BeastmodeIII", status: 2, id: "125"}]
  focus: string = "";
  channelList: any[] = [];
  colorMap: Map<string, string> = new Map<string, string>();
  socket: Socket;

  user: any = {id: "123"}

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @ViewChild('inputPrivate') inputPrivate: ElementRef<HTMLInputElement>;

  @ViewChild('frame') frame: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    if (this.scroll && this.frame)
      this.frame.nativeElement.scroll({top: this.frame.nativeElement.scrollHeight, behavior: "smooth"});
      
  }

  ngOnInit(): void {
    this.socket = io('http://localhost:3001');
    this.socket.onAny((type, data) => {
    });

    this.socket.on('message', (data: {
      id: string,
      user_id: string,
      username: string,
      message: string,
      type: number
    }) => {
      data.user_id = String(data.user_id);
      
      this.messages.push({id: data.id, username: data.username, message: data.message, user_id: data.user_id, type: data.type});
      if (this.messages.length > 25)
        this.messages.splice(0, 1);
      this.generateRandomColors();
      this.scroll = true;
    })


    this.http.get('http://localhost:3000/channels').subscribe({next: data => {
      console.log("fetched channels", data);
      this.channelList = data as any[];
    },
    error: _ => {
      console.error("error during channels fetch");
      
    }});
  }

  ngOnDestroy(): void {
      this.socket.disconnect();
  }

  getStatusColor(friend: any) {
    if (!friend.status)
      return '#700303';
    else if  (friend.status == 1)
      return '#3e7739';
    return '#e9d901';
  }

  generateRandomColors() {
    
    this.messages.forEach(val => {
      const tmp: string = val.user_id as string;
      if (!this.colorMap.has(tmp))
        this.colorMap.set(tmp, '#' + Math.floor(Math.random() * 16777215).toString(16));
        
    });

    
  }


  sendMessage() {
    if (this.chat.public)
    {
      this.socket.emit('message', {
        user_id: 123,
        message: this.input.nativeElement.value,
        type: 1,
        chat: {public: true, id: this.chat.id}})
        this.input.nativeElement.value = "";
      }
      else
      {
        console.log("test: " + this.chat.id);
        
        this.socket.emit('message', {
          user_id: 123,
          message: this.inputPrivate.nativeElement.value,
          type: 1,
          chat: {public: false, id: this.chat.id}})
        this.inputPrivate.nativeElement.value = "";
      }
        

  }

  openPrivate(friend: any) {
    console.log("Opening chat " + friend.id + " with ", friend);

    console.log("user:", this.user);
    
    this.socket.emit('connectRoom', {user_id: "123", chat: {public: false, id: friend.id}});
    this.http.get('http://localhost:3000/private/' + "123" + "/" + friend.id).subscribe(data => {
      console.log("fetched private history", data);
      this.messages = data as {id: string, username: string, user_id: string, type: number, message?: string}[];
      this.generateRandomColors();
      
    });

    this.chat.id = friend.id;
    this.chat.name = friend.username;
    this.chat.public = false;
    if (!this.chat.show)
      this.chat.show = true;
    else
      this.chat.show = false;
  }

  openPublic(channel: any) {
    console.log("opening channel", channel);
    
    if (channel.access == 2)
      return ;
    else if (channel.access == 1)
    {

      const tmp = this.dialog.open(DialogProtectedChat, {
        data: {
          wesh: "bite"
        }
      });
      tmp.afterClosed().subscribe(data => {
        console.log("closed dialog", data);
        
      })
      
      return;
    }


    if (!this.chat.show)
    {
      this.scroll = true;
      this.socket.emit('connectRoom', {user_id: "123", chat: {public: true, id: channel.id}});

      this.http.get('http://localhost:3000/history/' + channel.id).subscribe(data => {
        console.log("fetched history", data);
        
        this.messages = data as {id: string, user_id: string, type: number, username: string, message?: string}[];
        this.chat.id = channel.id;
        this.chat.name = channel.name;
        this.chat.public = true;
        
        this.generateRandomColors();
      });
      this.chat.show = true;
    }
    else
      this.chat.show = false;
  }

  focusFriend(username: string) {
    this.focus = username;
  }

  unfocusFriend() {
    this.focus = "";
  }

  openFriendList(event?: any) {
    this.chat.show = false;

    this.friendList.sort((a, b) => {
      return b.status - a.status;
    })

    this.socket.emit('disconnectRoom')
  }

  openUserDialog(message: any) {
    console.log("opening dialog", message);
    
    this.dialog.open(DialogUser, {
      data: {
        username: message.username,
        id: message.user_id,
        my_id: this.user.id
        
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
    this.dialog.open(DialogCreateChat, {
      data: {
        //data
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
  selector: "dialog-spec",
  templateUrl: "./dialog-spectator.html"
})
export class DialogSpectator implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogSpectator>, public dialog: MatDialog) {}

  ngOnInit(): void {
      console.log(this.data);
      
  }

  openUserProfile(message: any) {
    //this.dialogRef.close();
    
    const ref = this.dialog.open(DialogUser, {
      data: {
        username: message.username,
        id: message.user_id
      }
    });
    

  }
}

@Component({
  selector: "dialog-user",
  templateUrl: "./dialog-user.html"
})
export class DialogUser implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
    this.username = data.username;
    this.id = data.id;
    this.my_id = data.my_id;
  }

  
  user: any = {};
  error: boolean = false;

  ngOnInit(): void {
    this.http.get('http://localhost:3000/user/id/' + this.id).subscribe({
      next: data => {
        console.log("fetched user id = " + this.id, data);
        if (data)
          this.user = data;
        else
          this.error = true;
      },
      error: data => {
        console.log("could not fetch user");
        this.error = true;
      }
    })
  }


  my_id: string = "";
  id: string = "";
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

@Component({
  selector: "dialog-create-chat",
  templateUrl: "./dialog-create-chat.html"
})
export class DialogCreateChat {
  constructor(private http: HttpClient, dialogRef: MatDialogRef<DialogCreateChat>) {}

  passwordInput: boolean = false;
  access: number = 0;

  hidePassword() {
    this.passwordInput = false;
  }
  
  showPassword() {
    this.passwordInput = true;
  }

  setAccess(value: number) {
    this.access = value;
  }

  createChat(name: string, passwordOne?: string, passwordTwo?: string) {
    if (this.access == 1)
    {
      if (passwordOne != passwordTwo)
        return ;
      this.http.post('http://localhost:3000/channels', {name: name, access: this.access, password: passwordOne, creator_id: "123"}).subscribe();
      return ;
    }
    this.http.post('http://localhost:3000/channels', {name: name, access: this.access, creator_id: "123"}).subscribe();
  }

}