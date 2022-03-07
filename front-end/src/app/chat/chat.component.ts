import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { io, Socket } from 'socket.io-client';
import { DialogInvite } from './dialogs/dialog-invite-channel.component';
import { DialogChannelSettings } from './dialogs/dialog-channel-settings.component';
import { DialogCreateChat } from './dialogs/dialog-create-chat.component';
import { DialogProtectedChat } from './dialogs/dialog-protected-chat.component';
import { DialogSpectator } from './dialogs/dialog-spectator.component';
import { DialogUser } from './dialogs/dialog-user.component';
import { DialogBanned } from './dialogs/dialog-banned.component';
import { DialogAddFriend } from './dialogs/dialog-add-friend.component';
import { DialogMuted } from './dialogs/dialog-muted.component';
import { DialogAccessChat } from './dialogs/dialog-access-chat.component';
import { GlobalConsts } from '../common/global';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
	constructor(public dialog: MatDialog, private http: HttpClient) { }

	chat: {show: boolean, public: boolean, access: number, id: string, user_id: string, name: string, moderator: boolean, creator_id: string} = {show: false, public: true, name: "", id: "", user_id: "", moderator: true, creator_id: '79139', access: 0};
	messages: {id: string, username: string, user_id: string, type: number, message?: string}[] = [];

	scroll: boolean = false;
	friendList: any[] = [];
	focus: string = "";
	channelList: any[] = [];
	colorMap: Map<string, string> = new Map<string, string>();
	socket: Socket;
	blocked: any[] = [];

	user: any = {}
	password: string = "";

	@ViewChild('input') input: ElementRef<HTMLInputElement>;

	@ViewChild('inputPrivate') inputPrivate: ElementRef<HTMLInputElement>;

	@ViewChild('framePublic') framePublic: ElementRef<HTMLDivElement>;
	@ViewChild('framePrivate') framePrivate: ElementRef<HTMLDivElement>;


	ngAfterViewChecked(): void {
		if (this.scroll)
		{
			console.log("scrolling..");
			if (this.chat.public && this.framePublic)
			this.framePublic.nativeElement.scroll({top: this.framePublic.nativeElement.scrollHeight, behavior: "smooth"});
			else if (!this.chat.public && this.framePrivate)
			this.framePrivate.nativeElement.scroll({top: this.framePrivate.nativeElement.scrollHeight, behavior: "smooth"});
			this.scroll = false;
		}
	}

	fetchChannels() {
		this.http.get(`${GlobalConsts.userApi}/channels/`, {withCredentials: true}).subscribe({next: data => {
		console.log("fetched channels", data);
		this.channelList = data as any[];
		},
		error: _ => {
			console.error("error during channels fetch");
		}});
	}

	deleteFriend(friend: any) {
		this.http.patch(`${GlobalConsts.userApi}/friend`,
		{
			first: this.user.id,
			second: friend.id
		}, {withCredentials: true}).subscribe({
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
		this.http.get(`${GlobalConsts.userApi}/private/` + this.user.id + "/" + friend.id, {withCredentials: true}).subscribe(data => {
			console.log("fetched private history", data);
			this.messages = data as {id: string, username: string, user_id: string, type: number, message?: string}[];

			this.messages.forEach(msg => {
				if (this.blocked.find(val => val == msg.user_id))
				msg.message = '<message blocked>'
			})
			this.generateRandomColors();
		});
	}

	fetchChannelHistory(channel: any) {
		this.http.get(`${GlobalConsts.userApi}/history/` + channel.id, {headers: {password: this.password}, withCredentials: true}).subscribe(data => {
			console.log("fetched history", data);

			this.messages = data as {id: string, user_id: string, type: number, username: string, message?: string}[];

			this.messages.forEach(msg => {
				if (this.blocked.find(val => val == msg.user_id))
				msg.message = '<message blocked>'
			})

			this.chat.id = channel.id;
			this.chat.name = channel.name;
			this.chat.public = true;

			this.generateRandomColors();
		});
	}

	fetchBlockedUsers() {
		this.http.get(`${GlobalConsts.userApi}/block/` + this.user.id, {withCredentials: true}).subscribe(data => {
			this.blocked = data as any[];
		});
	}

	ngOnInit(): void {
		this.socket = io('/chat', {
			path: '/chat/socket.io',
			withCredentials: true
		});

		this.socket.on('user', () => {
			this.http.get(`${GlobalConsts.userApi}/user/id`, {withCredentials: true}).subscribe((data: any) => {
				this.user = data;				
				this.socket.emit('user', {user_id: data.id});
			})
		})

		this.socket.on('mod', (data: string) => {
			if (this.chat.id == data)
				this.chat.moderator = true;
			const chan = this.channelList.findIndex(val => val.id == data)
			if (chan >= 0)
				this.channelList[chan].moderator = true;
		});

		this.socket.on('unmod', (data: string) => {
			if (this.chat.id == data)
				this.chat.moderator = false;
			const chan = this.channelList.findIndex(val => val.id == data)
			if (chan >= 0)
				this.channelList[chan].moderator = false;
		})

		this.socket.on('mute', data => {
			this.dialog.open(DialogMuted, {
				data: {
					date: data.date
				}
			})
		})

		this.http.get(`${GlobalConsts.userApi}/user/id`, {withCredentials: true}).subscribe((data: any) => {
			this.user.id = data.id;
			this.fetchBlockedUsers();
		})

		this.socket.on('message', (data: {
			id: string,
			user_id: string,
			username: string,
			message: string,
			type: number
		}) => {
			data.user_id = String(data.user_id);

			if (this.blocked.find(val => val == data.user_id))
			data.message = '<message blocked>'

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
		this.http.post(`${GlobalConsts.userApi}/friend/`, {
			first: this.user.id,
			second: friend.id
		}, {withCredentials: true}).subscribe({
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
				chat: {public: true, id: this.chat.id}
			});
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
		this.http.get(`${GlobalConsts.userApi}/channels/access/` + channel.id,
		{withCredentials: true})
		.subscribe({next: (data) => {
			console.log("received response from connectRoom:", data);

			if (data == 0)
			{
				this.socket.emit('connectRoom', {user_id: this.user.id, chat: {public: true, id: channel.id}, password: this.password});
				this.messages = [];
				this.fetchChannelHistory(channel);
				this.chat.show = true;
				this.chat.creator_id = channel.creator_id;
				this.chat.moderator = channel.moderator;
				this.chat.access = channel.access;
				this.scroll = true;
			} else if (data == 2) //user is banned
			{
				this.dialog.open(DialogBanned);
			} else if (data == 1) {
				this.dialog.open(DialogAccessChat);
			}

		}});
	}

	openPublic(channel: any) {
		console.log("opening channel", channel);

		if (channel.access == 1) //protected channel
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
		else //open or private channel
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
		this.http.get(`${GlobalConsts.userApi}/friend/` + this.user.id, {withCredentials: true}).subscribe({next:
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

		this.fetchChannels();
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

			const tmp = this.dialog.open(DialogUser, {
				data: {
					username: message.username,
					id: message.user_id,
					my_id: this.user.id,
					friends: this.friendList,
					blocked: this.blocked
				}
			});
			tmp.afterClosed().subscribe(() => {
				this.fetchBlockedUsers();
				console.log("fetching blocked", this.blocked);

			});
		}
		else
		{
			const tmp = this.dialog.open(DialogUser, {
				data: {
					username: this.chat.name,
					id: this.chat.id,
					my_id: this.user.id,
					friends: this.friendList,
					blocked: this.blocked
				}
			});

			tmp.afterClosed().subscribe(() => {
				this.fetchBlockedUsers();
				console.log("fetching blocked 2", this.blocked);

			})
		}
	}

	openSpec() {
		const tmp = this.dialog.open(DialogSpectator, {
			data :
			{
				chat: this.chat,
				my_id: this.user.id,
				friends: this.friendList,
				blocked: this.blocked,
				socket: this.socket
				//channel name to send and moderator status
			}
		});

		tmp.afterClosed().subscribe(() => {
			this.fetchBlockedUsers();
		});

	}

	inviteFriend() {
		this.dialog.open(DialogInvite, {
			data: {
				chat: this.chat
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
