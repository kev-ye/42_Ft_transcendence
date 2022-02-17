import { Inject, Injectable, OnModuleInit, Req } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { stringify } from "querystring";
import { lastValueFrom } from "rxjs";
import { Socket, Server } from "socket.io";
import { ActiveUsersService } from "src/active-users/active-users.service";
import { ChannelsService } from "src/channels/channels.service";
import { ChatHistoryService } from "src/chat-history/chat-history.service";
import { PrivateService } from "src/private/private.service";
import { UserService } from "src/user/user.service";


@WebSocketGateway(3001, {cors: {
    origin: 'http://localhost:4200',
    methods: ["GET", "POST"],
    credentials: true
}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    onModuleInit() {
    }

    rooms: Map<string, string> = new Map();

    constructor(
        @Inject('PRIVATE_SERVICE') private privateService: PrivateService,
        @Inject('USER_SERVICE') private userService: UserService,
        @Inject('CHAT_HISTORY_SERVICE') private history: ChatHistoryService,
    @Inject('CHANNELS_SERVICE') private chanService: ChannelsService,
    @Inject('ACTIVE_USERS_SERVICE') private activeService: ActiveUsersService) {}

    handleConnection(client: any, ...args: any[]) {
        this.rooms.set(client.id, "");
        this.activeService.addUser({id: client.id});
    }

    handleDisconnect(client: any) {
        this.switchChannel(client);
        this.activeService.removeUserBySocketId(client.id);
        this.rooms.delete(client.id);
    }

    switchChannel(client: any, to?: string) {
        if (to != undefined)
        {
            console.log("updating user switch", client.id, to);
            
            this.activeService.updateUser({id: client.id, chat_id: to});
        }
        else
        {
            this.activeService.updateUser({id: client.id, chat_id: ""}); 
        }
        let tmp = this.rooms.get(client.id);
        if (tmp != "")
        {
            client.leave(tmp);
            tmp = "";
        }
        if (to != undefined)
        {
            tmp = to;
            client.join(to);
        }
        this.rooms.set(client.id, tmp);
    }

    async banUser(@MessageBody() data: any) {
        //check if user is moderator

        const tmp = await this.activeService.getUser(data.user_id);
        console.log("banService", tmp);
        
        if (tmp.length > 0)
        {
            tmp.forEach(val => {
                if (this.server.sockets.sockets.has(val.id))
                {
                    console.log('emit ban to ' + val.user_id);
                    
                    const sock = this.server.sockets.sockets.get(val.id);
                    if (val.chat_id == data.chat_id)
                        sock.emit('ban');
                }
            })
        }
    }

    @SubscribeMessage('user')
    async getUserFromSocker(@MessageBody() data: any, @ConnectedSocket() client: Socket)
    {
        console.log("update user", data);
        
        this.activeService.updateUser({id: client.id, user_id: data.user_id});
    }

    @SubscribeMessage('message')
    async receiveMessage(@ConnectedSocket() client: Socket, @MessageBody() data: {        
        user_id: string,
        message: string,
        type: number,
        chat: {public: boolean, id: string}})
    {
        console.log("received message", data);
        
        const user = await this.userService.getUserById(data.user_id);
        
        if (!user)
            return ;
        
        if (data.chat.public)
        {
            const id = await this.history.create({user_id: data.user_id, message: data.message, type: data.type, chat_id: data.chat.id});
            this.server.to(data.chat.id).emit('message', {id: id.id, user_id: data.user_id, username: user.name, message: data.message, type: data.type});
            return ;
        }
        
        const id = await this.privateService.postMessage({from: data.user_id, to: data.chat.id, type: data.type, message: data.message});

        if (data.user_id < data.chat.id)
            this.server.to(data.user_id + " | " + data.chat.id).emit('message', {id: id, user_id: data.user_id, username: user.name, message: data.message, type: data.type});
        else// if (data.user_id != data.chat.id)
            this.server.to(data.chat.id + " | " + data.user_id).emit('message', {id: id, user_id: data.user_id, username: user.id, message: data.message, type: data.type});        
        return ;
    }

    @SubscribeMessage('connectRoom')
    async connectChannel(@ConnectedSocket() client: Socket, @MessageBody() data: {
        user_id: string,
        chat: {public: boolean, id: string},
        password?: string}) {
        
        if (data.chat.public)
        {
            const tmp = await this.chanService.getChannelById(data.chat.id);
            if (tmp)
            {
                if (tmp.access == 1)
                {
                    if (data.password == undefined)
                        return false;
                    if (this.chanService.checkPassword(data.password, data.chat.id))
                        this.switchChannel(client, data.chat.id);
                    else
                        return false;
                }
                else if (tmp.access == 0)
                    this.switchChannel(client, data.chat.id);
                else
                    return false;
                return true;
            }
            return false;
        }
        else {
            //check to ?

            if (data.user_id < data.chat.id)
                this.switchChannel(client, data.user_id + " | " + data.chat.id);
            else// if (data.user_id != data.chat.id)
                this.switchChannel(client, data.chat.id + " | " + data.user_id);
        }
    }

    @SubscribeMessage('disconnectRoom')
    async disconnectChannel(@ConnectedSocket() client: Socket) {
        return this.switchChannel(client);
    }

}