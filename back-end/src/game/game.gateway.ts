import { OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
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
      //client must send his user details when he receives this signal
  }

  async handleDisconnect(client: any) {
      await this.playerService.deletePlayerBySocketId(client.id);
  }


  //client sends his user details so we update player DB
  @SubscribeMessage('user')
  async updateUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    await this.playerService.setUserIdBySocketId(client.id, data.id);
  }

  async joiningGame(client: Socket, gameID: string) {
    const user = await this.playerService.getPlayerBySocketId(client.id);
    if (!user || user.game_id)
      return false;
    client.join(gameID);
    
    await this.service.joinGame(user.user_id, gameID);
    await this.playerService.setGameID(user.user_id, gameID);
    client.emit('joinedGame', {game_id: gameID}); //show game to user when he receives this signal

    //todo: send gameReady when 2 players are in the room
    //todo: send startGame
  }

  @SubscribeMessage('connectGame')
  async connectToGame(@MessageBody() data: {game_id: string}, @ConnectedSocket() client: Socket) {
    const tmp = await this.service.getGameById(data.game_id);
    if (!tmp)
    {
      client.emit('gameNotFound')
      return ;
    }
    
    this.joiningGame(client, data.game_id);
  }

  async startGame(game: any) {
    this.server.to(game.id).emit('start');
  }

  @SubscribeMessage('ready')
  async setPlayerReady(@MessageBody() data: {game_id: string}, @ConnectedSocket() client: Socket) {
    const tmp = await this.playerService.getPlayerBySocketId(client.id);

    if (!tmp || !tmp.game_id)
      return;
    const game = await this.service.getGameById(data.game_id);
    if (!game)
      return;
    const res = await this.service.setPlayerState(client.id, 1);
    if (res.first_state == 1 && res.second_state == 1)
    {
      //start game if both players are ready
      this.startGame(res);
    }
    
  }

  @SubscribeMessage('disconnectGame')
  async disconnectFromGame(@MessageBody() data: {game_id: string}, @ConnectedSocket() client: Socket) {
    client.leave(data.game_id);
  }

  @Interval(3000)
  async checkMatchmaking() {
    console.log("Matchmaking");
    
    const tmp = await this.playerService.getLookingPlayers();
    if (tmp.length < 2)
      return ;
    const game = await this.service.createGame();
    await this.service.joinGame(tmp[0].user_id, game.id);
    await this.service.joinGame(tmp[1].user_id, game.id);
    await this.playerService.updatePlayer({id: tmp[0].id}, {status: 2});
    await this.playerService.updatePlayer({id: tmp[1].id}, {status: 2});


  }

  @SubscribeMessage('startMatchmaking')
  async joinMatchmaking(@ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('stopMatchmaking')
  async leaveMatchmaking(@ConnectedSocket() client: Socket) {

  }
  
}
