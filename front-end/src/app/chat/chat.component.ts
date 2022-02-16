import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SocketFactory } from 'ngx-socket-io/src/socket-io.module';
import { io, Socket } from 'socket.io-client';
import { DialogInvite } from './dialogs/dialog-invite-channel.component';
import { DialogChannelSettings } from './dialogs/dialog-channel-settings.component';
import { DialogCreateChat } from './dialogs/dialog-create-chat.component';
import { DialogProtectedChat } from './dialogs/dialog-protected-chat.component';
import { DialogSpectator } from './dialogs/dialog-spectator.component';
import { DialogUser } from './dialogs/dialog-user.component';
import { DialogBanned } from './dialogs/dialog-banned.component';
import { DialogAddFriend } from './dialogs/dialog-add-friend.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  chat: {show: boolean, public: boolean, id: string, user_id: string, name: string, moderator: boolean} = {show: false, public: true, name: "", id: "", user_id: "", moderator: true};
  messages: {id: string, username: string, user_id: string, type: number, message?: string}[] = [];
  
  scroll: boolean = false;
  //messages : {id: number, username: string, message: string}[] = [{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "xxxxx"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wagrtek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wartek", message: "incroyable ?"},{id: 1, username: "wardtek", message: "incroyable ?"}];
  
  friendList: any[] = [];
  //friendList: any[] = [{username: "wartek", status: 0, id: "124"}, {username: "diablox9", status: 1, id: "145"}, {username: "BeastmodeIII", status: 2, id: "125"}]
  focus: string = "";
  channelList: any[] = [];
  colorMap: Map<string, string> = new Map<string, string>();
  socket: Socket;

  user: any = {}
  password: string = "";

  @Input('socketID') socketID: string = "";

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @ViewChild('inputPrivate') inputPrivate: ElementRef<HTMLInputElement>;

  @ViewChild('frame') frame: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    if (this.scroll && this.frame)
      this.frame.nativeElement.scroll({top: this.frame.nativeElement.scrollHeight, behavior: "smooth"});
      
  }

  fetchChannels() {
    this.http.get('http://localhost:3000/channels').subscribe({next: data => {
      console.log("fetched channels", data);
      this.channelList = data as any[];
    },
    error: _ => {
      console.error("error during channels fetch");
      
    }});
  }

  deleteFriend(friend: any) {
    this.http.patch('http://localhost:3000/friend',
    {
      first: this.user.id,
      second: friend.id
    }).subscribe({
      next: data => {
        console.log("Deleted friend");
        this.fetchFriends();
        
      }, error: data => {
        console.log("Could not delete friend");
        
      }
    });
  }
  
  openFriendDialog() {
    const tmp = this.dialog.open(DialogAddFriend, {
      data: {
        my_id: this.user.id
      }
    });
    tmp.afterClosed().subscribe(() => {
      this.fetchFriends();
    })
  }

  openChannelSettings() {
    if (!this.chat.moderator)
      return ;
    const tmp = this.dialog.open(DialogChannelSettings, {
      data: {
        ...this.chat,
        user_id: this.user.id, //data
      }
    });
		tmp.afterClosed().subscribe(() => {
			this.fetchChannels();
		})
    
  }

  fetchPrivateMessage(friend: any) {
    this.messages = [];
    this.http.get('http://localhost:3000/private/' + this.user.id + "/" + friend.id).subscribe(data => {
      console.log("fetched private history", data);
      this.messages = data as {id: string, username: string, user_id: string, type: number, message?: string}[];
      this.generateRandomColors();
    });
  }

  fetchChannelHistory(channel: any) {
    this.http.get('http://localhost:3000/history/' + channel.id, {headers: {password: this.password}}).subscribe(data => {
      console.log("fetched history", data);
      
      this.messages = data as {id: string, user_id: string, type: number, username: string, message?: string}[];
      this.chat.id = channel.id;
      this.chat.name = channel.name;
      this.chat.public = true;


      
      this.generateRandomColors();
    });
  }

  ngOnInit(): void {
    this.socket = io('http://localhost:3001');
    
    this.socket.on('connect', () => {

      this.socket.emit('user', {user_id: this.user.id});
    });

    
    this.socket.on('reconnect', () => { 

      this.socket.emit('user', {user_id: this.user.id});
    });
    

    this.http.get('http://localhost:3000/user/id', {withCredentials: true}).subscribe((data: any) => {
      this.user.id = data.id;      
    })

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

    this.socket.on('ban', () => {
      if (this.chat.show && this.chat.public)
        this.openFriendList();
    });


    this.fetchChannels();
  }

  ngOnDestroy(): void {
      this.socket.disconnect();
  }

  getStatusColor(friend: any) {
    if (friend.status == 1) //invite pending
      return '#e9d901';
    if (!friend.online)
      return '#700303';
    else if  (friend.online == 1)
      return '#3e7739';
    return '#e9d901';
  }

  addFriend(friend: any) {
    this.http.post('http://localhost:3000/friend/', {
      first: this.user.id,
      second: friend.id
    }).subscribe({
      next:
      data => {
        console.log("accepted invite from user " + friend.id);
        this.fetchFriends();
      }
    })
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
        user_id: this.user.id,
        message: this.input.nativeElement.value,
        type: 1,
        password: this.password,
        chat: {public: true, id: this.chat.id}})
        this.input.nativeElement.value = "";
      }
      else
      {
        console.log("test: " + this.chat.id);
        
        this.socket.emit('message', {
          user_id: this.user.id,
          message: this.inputPrivate.nativeElement.value,
          type: 1,
          chat: {public: false, id: this.chat.id}})
        this.inputPrivate.nativeElement.value = "";
      }
        

  }

  openPrivate(friend: any) {
    console.log("Opening chat " + friend.id + " with ", friend);

    console.log("user:", this.user);
    
    this.socket.emit('connectRoom', {user_id: this.user.id, chat: {public: false, id: friend.id}});
    this.fetchPrivateMessage(friend);

    this.chat.id = friend.id;
    this.chat.name = friend.username;
    this.chat.public = false;
    if (!this.chat.show)
      this.chat.show = true;
    else
      this.chat.show = false;
  }
   
  connectRoom(channel: any) {
    this.http.post('http://localhost:3000/access', {
      user_id: this.user.id,
      chat_id: channel.id}).subscribe({next: (data) => {
        console.log("received response from connectRoom:", data);
        
        if (data)
        {
          this.scroll = true;
          this.socket.emit('connectRoom', {user_id: this.user.id, chat: {public: true, id: channel.id}, password: this.password});
          this.messages = [];
          this.fetchChannelHistory(channel);
          this.chat.show = true;
        } else
        {
          this.dialog.open(DialogBanned);
        }
      }});
  }

  openPublic(channel: any) {
    console.log("opening channel", channel);
    
    if (channel.access == 2) //private channel
      return ;
    else if (channel.access == 1) //protected channel
    {
      const tmp = this.dialog.open(DialogProtectedChat, {
        data: {
          id: channel.id
        }
      });
      
      tmp.afterClosed().subscribe(data => {
        if (data && data.password)
          this.password = data.password;
        if (data && data.success)
        {
          this.connectRoom(channel);
          return ;
        }
        
      });
      
    }
    else if (channel.access == 0) //open channel
    {
      if (!this.chat.show)
        this.connectRoom(channel);
      else
        this.chat.show = false;
    }
  }

  focusFriend(username: string) {
    this.focus = username;
  }

  unfocusFriend() {
    this.focus = "";
  }

  fetchFriends() {
    this.http.get('http://localhost:3000/friend/' + this.user.id).subscribe({next:
    data => {
      console.log("fetched friends", data);
      this.friendList = data as any[];
    },
  error: 
    data => {
      console.error("could not fetch friends");
    }})
  }

  openFriendList(event?: any) {
    this.chat.show = false;


    this.fetchFriends();
    /*this.friendList.sort((a, b) => {
      return b.status - a.status;
    })
    */

    this.socket.emit('disconnectRoom')
  }

  openUserDialog(message?: any) {
    if (message)
    {

      console.log("opening dialog", message);
      
      this.dialog.open(DialogUser, {
        data: {
          username: message.username,
          id: message.user_id,
          my_id: this.user.id,
        }
      })
    }
    else
    {
      this.dialog.open(DialogUser, {
        data: {
          username: this.chat.name,
          id: this.chat.id,
          my_id: this.user.id,
        }
      })
    }
  }

  openSpec() {
    this.dialog.open(DialogSpectator, {
      data :
      {
        chat: this.chat,
        my_id: this.user.id
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
    const tmp = this.dialog.open(DialogCreateChat, {
      data: {
        user_id: this.user.id
      }
    });
    tmp.afterClosed().subscribe(data => {
      this.fetchChannels();
    })
  }

}