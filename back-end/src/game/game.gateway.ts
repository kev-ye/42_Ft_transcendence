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

  getSocket(socketID: string) {
    if (this.server.sockets.sockets.has(socketID))
      return this.server.sockets.sockets.get(socketID);
    return null;
  }
  

  emitRoom(room: string, event: string, ...args: any[]) {
    this.server.to(room).emit(event, args);
  }

  async handleConnection(client: any, ...args: any[]) {
      await this.playerService.createPlayer(client.id);
      console.log("handleConnection gameSocket", args);
      
      client.emit('user');
      //client must send his user details when he receives this signal
  }

  async handleDisconnect(client: Socket) {
    await this.service.handleDisconnect(client.id);
    await this.playerService.deletePlayerBySocketId(client.id);
  }


  //client sends his user details so we update player DB
  @SubscribeMessage('user')
  async updateUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log("received user", data);
    
    await this.playerService.setUserIdBySocketId(client.id, data.id);
  }

  async joiningGame(client: Socket, gameID: string) {
    const user = await this.playerService.getPlayerBySocketId(client.id);
    if (!user || user.game_id)
      return false;
    client.join(gameID);
    
    await this.service.joinGame(user.socket_id, gameID);
    await this.playerService.setGameID(user.socket_id, gameID);
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
    if (tmp.first && tmp.second)
    {
      client.emit('error', {error: 'Game is full'})
    }
    
    this.service.joinGame(client.id, data.game_id);
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
  async disconnectFromGame(@ConnectedSocket() client: Socket) {
    await this.service.handleDisconnect(client.id);
  }

  @Interval(3000)
  async checkMatchmaking() {
    
    const tmp = await this.playerService.getLookingPlayers();
    console.log("Matchmaking: " + tmp.length);
    if (tmp.length < 2)
      return ;
    const game = await this.service.createGame();
    await this.service.joinGame(tmp[0].socket_id, game.id);
    await this.service.joinGame(tmp[1].socket_id, game.id);
    await this.playerService.updatePlayer({id: tmp[0].id}, {status: 2});
    await this.playerService.updatePlayer({id: tmp[1].id}, {status: 2});

    const player_1 = await this.playerService.getPlayerByUserId(tmp[0].user_id);
    const player_2 = await this.playerService.getPlayerByUserId(tmp[1].user_id);

    player_1.forEach(val => {
      const sock = this.getSocket(val.socket_id);
      if (sock)
      {
        sock.join(game.id);
      }
    });
    player_2.forEach(val => {
      const sock = this.getSocket(val.socket_id);
      if (sock)
      {        
        sock.join(game.id);
      }
    });

    this.server.to(game.id).emit('joinedGame');
  }

  @SubscribeMessage('startMatchmaking')
  async joinMatchmaking(@ConnectedSocket() client: Socket) {
    const tmp =  await this.playerService.getPlayerBySocketId(client.id);

    //todo: check if same user is in matchmaking
    if (!tmp || !tmp.user_id)
      return ;
    
    await this.playerService.updatePlayer({id: tmp.id}, {status: 1});
  }

  @SubscribeMessage('stopMatchmaking')
  async leaveMatchmaking(@ConnectedSocket() client: Socket) {
    const tmp =  await this.playerService.getPlayerBySocketId(client.id);

    if (!tmp || !tmp.user_id)
      return ;
    await this.playerService.updatePlayer({id: tmp.id}, {status: 0});
  }
  
}
