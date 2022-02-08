import { Inject, Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { stringify } from "querystring";
import { Socket, Server } from "socket.io";
import { ChannelsService } from "src/channels/channels.service";
import { ChatHistoryService } from "src/chat-history/chat-history.service";
import { PrivateService } from "src/private/private.service";
import { UserService } from "src/user/user.service";


@WebSocketGateway(3001, {cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server: Server;

    rooms: Map<string, string> = new Map();

    constructor(@Inject('CHAT_HISTORY_SERVICE') private history: ChatHistoryService,
    @Inject('PRIVATE_SERVICE') private privateService: PrivateService,
    @Inject('USER_SERVICE') private userService: UserService,
    @Inject('CHANNELS_SERVICE') private chanService: ChannelsService) {}

    handleConnection(client: any, ...args: any[]) {
        console.log("Connect " + client.id);
        this.rooms.set(client.id, "");
    }

    handleDisconnect(client: any) {
        console.log("Disconnect: " + client.id);
        this.switchChannel(client);
        this.rooms.delete(client.id);
    }

    switchChannel(client: any, to?: string) {
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

    @SubscribeMessage('message')
    async receiveMessage(@ConnectedSocket() client: Socket, @MessageBody() data: {
        user_id: string,
        message: string,
        type: number,
        chat: {public: boolean, id: string}})
    {
        const user = await this.userService.getUserById(data.user_id);
        
        if (!user)
            return ;
        console.log("message", data);
        
        if (data.chat.public)
        {
            const id = await this.history.create({user_id: data.user_id, message: data.message, type: data.type, chat_id: data.chat.id});
            this.server.to(data.chat.id).emit('message', {id: id.id, user_id: data.user_id, username: user.name, message: data.message, type: data.type});
            return ;
        }
        
        const id = await this.privateService.postMessage({from: data.user_id, to: data.chat.id, type: data.type, message: data.message});

        if (data.user_id < data.chat.id)
            this.server.to(data.user_id + " | " + data.chat.id).emit('message', {id: id, user_id: data.user_id, username: user.name, message: data.message, type: data.type});
        else if (data.user_id != data.chat.id)
            this.server.to(data.chat.id + " | " + data.user_id).emit('message', {id: id, user_id: data.user_id, username: user.id, message: data.message, type: data.type});        
        return ;
    }

    @SubscribeMessage('connectRoom')
    async connectChannel(@ConnectedSocket() client: Socket, @MessageBody() data: {
        user_id: string,
        chat: {public: boolean, id: string},
        password?: string}) {
        
        console.log("connect " + client.id);
        
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
            else if (data.user_id != data.chat.id)
                this.switchChannel(client, data.chat.id + " | " + data.user_id);
        }
    }

    @SubscribeMessage('disconnectRoom')
    async disconnectChannel(@ConnectedSocket() client: Socket) {
        return this.switchChannel(client);
    }

}