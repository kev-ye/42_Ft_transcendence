import { Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ActiveUsersService } from "src/active-users/active-users.service";

@WebSocketGateway(3002, {cors: {
    origin: 'http://localhost:4200',
    methods: ["GET", "POST"],
    credentials: true
}})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(@Inject('ACTIVE_USERS_SERVICE') private activeService: ActiveUsersService) {}

    checkCookie(client: any) {
        const cookie = '__pong_session_id__';

        const tmp: any[] = client.handshake.headers.cookie.split('; ');
        let result = tmp.find((val:string) => {
            return val.split('=')[0] == cookie;
        });
        if (result)
        {
            result = result.split('=')[1];

        }
        return ;
    }

    @SubscribeMessage('user')
    async auth(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        
        return await this.activeService.addUser({id: client.id, ...data});
    }

    async handleConnection(client: any, ...args: any[]) {

        /*console.log("add: ", client.id);
        await this.activeService.addUser({id: client.id});
        */
    }

    async handleDisconnect(client: any) {
        //await this.activeService.removeUserBySocketId(client.id);
    }


}