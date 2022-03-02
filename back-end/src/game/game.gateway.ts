import { OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { stat } from 'fs';
import { first } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { PlayersService } from 'src/players/players.service';
import { GameService } from './game.service';
export const TIME_TO_REFRESH = 200; //milliseconds
export const XSPEED_MIN = 0.1;
export const YSPEED_MIN = 0.1;
export const PLAYER_HEIGHT = 10; //percentage
export const SPEED_COEF = 10;

@WebSocketGateway(3002, {
  path: '/game/socket.io',
  namespace: 'game',
  cors: {
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:4200',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private playerService: PlayersService,
    private service: GameService) {}
    
    @WebSocketServer()
    server: Server;
    
    stats: Map<string, any> = new Map();
    
    async sleep(ms: number) {
      return new Promise(r => setTimeout(r, ms));
    }
    
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
    
    async checkForfeit(client: Socket) {
      const player = await this.playerService.getPlayerBySocketId(client.id);
      console.log("check forfeit: ", player);
      
      if (!player || !player.game_id)
        return ;
      const game = await this.service.getGameById(player.game_id);
      console.log("check forfeit2: ", game);
      
      if (game)
      {
        if (game.game_state == 1 && (game.first == client.id || game.second == client.id))
        {
          if (game.first == client.id)
          {
            this.playerLoses(game.first);
            this.playerWins(game.second);
          } else
          {
            this.playerWins(game.first);
            this.playerLoses(game.second);
          }
          //todo: save game in history
          console.log("Deleting game -- forfeit");
          
          this.stats.delete(game.id);
        }
      }
    }
    
    async handleDisconnect(client: Socket) {
      await this.checkForfeit(client);
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
      
      this.startGame(gameID);      
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
        this.startGame(res.id);
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
      
      const player_1 = await this.playerService.getPlayerBySocketId(tmp[0].socket_id);
      const player_2 = await this.playerService.getPlayerBySocketId(tmp[1].socket_id);
      
      const sock_1 = this.getSocket(player_1.socket_id);
      if (sock_1)
      {
        sock_1.join(game.id);
      }

      const sock_2 = this.getSocket(player_2.socket_id);
      if (sock_2)
      {
        sock_2.join(game.id);
      }
      
      this.startGame(game.id);
    }
    
    @SubscribeMessage('startMatchmaking')
    async joinMatchmaking(@ConnectedSocket() client: Socket) {
      let error: boolean = false;
      const tmp =  await this.playerService.getPlayerBySocketId(client.id);
      
      if (!tmp || !tmp.user_id)
        return ;
      
      //todo: check if same user is in matchmaking
      const players = await this.playerService.getLookingPlayers();
      players.forEach(val => {
        /*
        if (val.user_id == tmp.user_id)
          error = true;
          */
      })
      if (error)
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
    
    newRound(stats: any) {
      stats.pos.x = 0;
      stats.pos.y = 0;
      stats.speed = this.generateRandomSpeed();
      stats.first = 0;
      stats.second = 0;
    }
    
    async startGame(gameID: string) {
      let game = await this.service.getGameById(gameID);
      if (!game)
        return ;

      this.server.to(gameID).emit('joinedGame', {game_id: gameID});
      //wait 3 seconds to star
      this.sleep(3000);
      
      
      this.service.startGame(gameID);
      this.stats.set(game.id, {
        first: 0, //position of first player
        second: 0, //position of second player
        speed: this.generateRandomSpeed(), //ball's speed
        pos: { //ball's position
          x: 0,
          y: 0
        },
        power: {
          type: 0,
          pos : {
            x: 0,
            y: 0
          }
        }, //todo: implement powerups
        score: {first: 0, second: 0}
      });
      
      
      const interval = setInterval(() => {
        if (!this.stats.has(game.id))
        {
          clearInterval(interval);
          return ;
        }
        let data = this.stats.get(game.id);
        data.pos.x += data.speed.x;
        data.pos.y += data.speed.y;
        
        if (data.pos.x <= -50)
        {
          data.speed = this.generateRandomSpeed();
          data.score.second++;
          if (data.score.second >= game.limit_game)
          {
            this.playerWins(game.second);
            this.playerLoses(game.first);
            this.stopGame(game.id);
            clearInterval(interval);
          }
          this.newRound(data);
        }
        else if (data.pos.x >= 50)
        {
          data.speed = this.generateRandomSpeed();
          data.score.first++;
          if (data.score.first >= game.limit_game)
          {
            this.playerWins(game.first);
            this.playerLoses(game.second);
            this.stopGame(game.id);
            clearInterval(interval);
          }
          this.newRound(data);
        }
        
        if (data.pos.y <= -50 || data.pos.y >= 50) //todo: considerer ball radius
        {
          data.speed.y *= -1;
        }
        
        if (data.pos.x <= -45)
        {
          if (Math.abs(data.pos.y - data.first) <= PLAYER_HEIGHT)
          {
            data.speed.x *= -1;
          }
        }
        else if (data.pos.x >= 45)
        {
          if (Math.abs(data.pos.y - data.second) <= PLAYER_HEIGHT)
          {
            data.speed.y *= -1;
          }
        }
        this.emitRoom(gameID, 'refresh', data);
        
      }, TIME_TO_REFRESH);
      
      
    }
    
    async stopGame(gameID: string) {
      await this.service.stopGame(gameID);
    }
    
    generateRandomSpeed(): { x: number; y: number; } {
      let x = (Math.random() - 0.5) * SPEED_COEF;
      let y = (Math.random() - 0.5) * SPEED_COEF;
      
      if (Math.abs(x) < XSPEED_MIN)
      x = x < 0 ? -XSPEED_MIN : XSPEED_MIN;
      if (Math.abs(y) < YSPEED_MIN)
      x = x < 0 ? -YSPEED_MIN : YSPEED_MIN;
      return {x: x, y: y};
    }
    
    async playerLoses(socketID: string) {
      const sock = this.getSocket(socketID);
      if (sock)
        sock.emit('lose');
    }
    
    async playerWins(socketID: string) {
      const sock = this.getSocket(socketID);
      if (sock)
        sock.emit('win');
    }
  }