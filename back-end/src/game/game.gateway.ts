import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayersService } from 'src/players/players.service';
import { GameService } from './game.service';

@WebSocketGateway(3002, {cors: 'http://localhost:4200'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private playerService: PlayersService,
    private service: GameService) {}

  @WebSocketServer()
  server: Server;

  async emitUser(userID: string, event: string, ...args: any[]) {
    const tmp = await this.playerService.getPlayerByUserId(userID);
    if (tmp.length > 0)
    {
      for (let it of tmp)
      {
        if (this.server.sockets.sockets.has(it.socket_id))
        {
          this.server.sockets.sockets.get(it.socket_id).emit(event, args);
        }
      }
    }
  }

  emitRoom(room: string, event: string, ...args: any[]) {
    this.server.to(room).emit(event, args);
  }

  async handleConnection(client: any, ...args: any[]) {
      await this.playerService.createPlayer(client.id);
      client.emit('user');
  }

  async handleDisconnect(client: any) {
      await this.playerService.deletePlayerBySocketId(client.id);
  }

  @SubscribeMessage('user')
  async updateUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    await this.playerService.setUserIdBySocketId(client.id, data.id);
  }

  @SubscribeMessage('connectGame')
  async connectToGame(@MessageBody() data: {game_id: string}, @ConnectedSocket() client: Socket) {
    const tmp = await this.service.getGameById(data.game_id);
    if (!tmp)
    {
      client.emit('gameNotFound')
      return ;
    }
    client.join(data.game_id);
    client.emit('joinedGame', {game_id: data.game_id});
  }
  
}
