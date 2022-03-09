import { OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { stat } from 'fs';
import { first } from 'rxjs';
import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { PlayersService } from 'src/players/players.service';
import { GameService } from './game.service';
export const TIME_TO_REFRESH = 20; //milliseconds
export const XSPEED_MIN = 1;
export const YSPEED_MIN = 1;
export const SPEED_COEF = 5;

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
  transports: ['websocket']
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private playerService: PlayersService,
    private service: GameService,
  ) {}

  game = {
		WIDTH:  100,
		HEIGHT: 100
	}

	paddle = {
		WIDTH:   1,
		HEIGHT:  20,
		PADDING: 4,
		RADIUS:  3,
		SPEED:   3
	}

	ball_t = {
		RADIUS: 1,
		SPEED:  1,
		X:      50,
		Y:      50
	}

  @WebSocketServer() 
  server: Server;

  stats: Map<string, any> = new Map();

  async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async emitUser(userID: string, event: string, ...args: any[]) {
    const tmp = await this.playerService.getPlayerByUserId(userID);
    if (tmp.length > 0) {
      await this.server.fetchSockets().then(data => {
        for (const it of tmp) {
          const sock = data.find(val => val.id == it.socket_id);
          if (sock)
            sock.emit(event, args);
        }
      });
    }
  }

  async getSocket(socketID: string): Promise<any> {
    let res: RemoteSocket<DefaultEventsMap, any> = null;
    await this.server.fetchSockets().then(data => {
      const sock = data.find(val => val.id == socketID);
      if (sock)
        res = sock;
    });
    return res;
  }

  emitRoom(room: string, event: string, ...args: any[]) {
    this.server.to(room).emit(event, args);
  }

  async handleConnection(client: any, ...args: any[]) {
    await this.playerService.createPlayer(client.id);
    console.log('handleConnection gameSocket', args);

    client.emit('user');
    //client must send his user details when he receives this signal
  }

  async checkForfeit(client: Socket) {
    const player = await this.playerService.getPlayerBySocketId(client.id);

    if (!player || !player.game_id) return;
    const game = await this.service.getGameById(player.game_id);

    if (game) {
      if (game.game_state == 1 && (game.first == client.id || game.second == client.id)) {
        if (game.first == client.id) {
          this.playerLoses(game.first);
          this.playerWins(game.second);
        }
        else {
          this.playerWins(game.first);
          this.playerLoses(game.second);
        }
        //todo: save game in history
        console.log('Deleting game -- forfeit');
        
        if (this.stats.get(game.id))
          this.stopGame(game.id, this.stats.get(game.id));
        else
          this.stats.delete(game.id);
      }
      else if (game.game_state == 0)
        this.service.deleteGameById(game.id);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log("handle disconnect game gateway");
    
    await this.checkForfeit(client);
    await this.playerService.deletePlayerBySocketId(client.id);
  }

  //client sends his user details so we update player DB
  @SubscribeMessage('user')
  async updateUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('received user', data);

    await this.playerService.setUserIdBySocketId(client.id, data.id);
  }

  async joiningGame(client: Socket, gameID: string) {
    const user = await this.playerService.getPlayerBySocketId(client.id);
    if (!user || user.game_id) return false;
    client.join(gameID);

    await this.service.joinGame(user.socket_id, gameID);
    await this.playerService.setGameID(user.socket_id, gameID);

    this.startGame(gameID);
  }

  @SubscribeMessage('connectGame')
  async connectToGame(
    @MessageBody() data: { game_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = await this.service.getGameById(data.game_id);
    if (!tmp) {
      client.emit('error', { error: 'Game was not found' });
      return;
    }
    if (tmp.first && tmp.second) {
      client.emit('error', { error: 'Game is full' });
    }

    const game = await this.service.joinGame(client.id, data.game_id);
    if (game)
      client.join(game.id);
    if (game.first && game.second)
      this.startGame(game.id);
  }

  @SubscribeMessage('disconnectGame')
  async disconnectFromGame(@ConnectedSocket() client: Socket) {
    //this.handleDisconnect(client);
    //client.disconnect();
  }

  @Interval(3000)
  async checkMatchmaking() {
    const tmp = await this.playerService.getLookingPlayers();
    // console.log('Matchmaking: ' + tmp.length);
    if (tmp.length < 2) return;
    const game = await this.service.createGame();
    await this.service.joinGame(tmp[0].socket_id, game.id);
    await this.service.joinGame(tmp[1].socket_id, game.id);
    await this.playerService.updatePlayer({ id: tmp[0].id }, { status: 2 });
    await this.playerService.updatePlayer({ id: tmp[1].id }, { status: 2 });

    const player_1 = await this.playerService.getPlayerBySocketId(
      tmp[0].socket_id,
    );
    const player_2 = await this.playerService.getPlayerBySocketId(
      tmp[1].socket_id,
    );

    const sock_1 = await this.getSocket(player_1.socket_id);
    if (sock_1) {
      sock_1.join(game.id);
    }

    const sock_2 = await this.getSocket(player_2.socket_id);
    if (sock_2) {
      sock_2.join(game.id);
    }

    this.startGame(game.id);
  }

  @SubscribeMessage('startMatchmaking')
  async joinMatchmaking(@ConnectedSocket() client: Socket) {
    
    const error = false;
    const tmp = await this.playerService.getPlayerBySocketId(client.id);
    
    console.log("startMatchmaking received", tmp);

    if (!tmp || !tmp.user_id) return;

    //todo: check if same user is in matchmaking
    const players = await this.playerService.getLookingPlayers();
    players.forEach((val) => {
      /*
        if (val.user_id == tmp.user_id)
          error = true;
          */
    });
    if (error) return;

    console.log("updated matchmaking player");
    
    await this.playerService.updatePlayer({ id: tmp.id }, { status: 1 });
  }

  @SubscribeMessage('stopMatchmaking')
  async leaveMatchmaking(@ConnectedSocket() client: Socket) {
    const tmp = await this.playerService.getPlayerBySocketId(client.id);

    if (!tmp || !tmp.user_id) return;
    await this.playerService.updatePlayer({ id: tmp.id }, { status: 0 });
  }

  @SubscribeMessage('spectate')
  async spectateGame(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    if (!data.game_id)
    {
      client.emit('error', {error: 'Could not find game to spectate'});
      return;
    }
    const game = await this.service.getGameById(data.game_id);
    if (!game)
    {
      client.emit('error', {error: 'Could not find game to spectate'});
      return;
    }
    client.join(data.game_id);
  }

  newRound(stats: any) {
    stats.pos.x = 0;
    stats.pos.y = 0;
    stats.speed = this.generateRandomSpeed();
    //stats.first = 0;
    //stats.second = 0;
  }

  async startGame(gameID: string) {
    const game = await this.service.getGameById(gameID);
    if (!game) return;

    this.server.to(gameID).emit('joinedGame', { game_id: gameID });
    //wait 3 seconds to start
    await this.sleep(3000);

    this.service.startGame(gameID);
    this.stats.set(game.id, {
      first: 0, //position of first player
      second: 0, //position of second player
      first_socket: game.first,
      second_socket: game.second,
      speed: this.generateRandomSpeed(), //ball's speed
      pos: {
        //ball's position
        x: 0,
        y: 0,
      },
      power: {
        type: 0,
        pos: {
          x: 0,
          y: 0,
        },
      }, //todo: implement powerups
      score: { first: 0, second: 0 },
    });

    const interval = setInterval(() => {
      if (!this.stats.has(game.id)) {
        clearInterval(interval);
        return;
      }
      const data = this.stats.get(game.id);
      data.pos.x += data.speed.x;
      data.pos.y += data.speed.y;
      if (data.pos.y <= -50) {
        //todo: considerer ball radius
        data.pos.y = -50;
        data.speed.y *= -1;
      }
      else if (data.pos.y >= 50)
      {
        data.pos.y = 50;
        data.speed.y *= -1;
      }

      if (data.pos.x <= -50) {
        data.speed = this.generateRandomSpeed();
        data.score.second++;
        if (data.score.second >= game.limit_game) {
          this.emitRoom(gameID, 'refresh', data);
          this.playerWins(game.second);
          this.playerLoses(game.first);
          this.stopGame(game.id, data);
          clearInterval(interval);
          return;
        }
        this.newRound(data);
      } else if (data.pos.x >= 50) {
        data.speed = this.generateRandomSpeed();
        data.score.first++;
        if (data.score.first >= game.limit_game) {
          this.emitRoom(gameID, 'refresh', data);
          this.playerWins(game.first);
          this.playerLoses(game.second);
          this.stopGame(game.id, data);
          clearInterval(interval);
          return;
        }
        this.newRound(data);
      }

      if (data.pos.x <= -45 && data.speed.x < 0) {
        if (Math.abs(data.pos.y - data.first) <= this.paddle.HEIGHT / 2) {
          data.speed.x *= -1;
        }
      } else if (data.pos.x >= 45 && data.speed.x > 0) {
        if (Math.abs(data.pos.y - data.second) <= this.paddle.HEIGHT / 2) {
          data.speed.x *= -1;
        }
      }
      this.emitRoom(gameID, 'refresh', data);
    }, TIME_TO_REFRESH);
  }

  async stopGame(gameID: string, data: any) {
    await this.service.stopGame(gameID, data);
    this.stats.delete(gameID);
  }

  generateRandomSpeed(): { x: number; y: number } {
    let x = (Math.random() - 0.5) * SPEED_COEF;
    const y = (Math.random() - 0.5) * SPEED_COEF;

    if (Math.abs(x) < XSPEED_MIN) x = x < 0 ? -XSPEED_MIN : XSPEED_MIN;
    if (Math.abs(y) < YSPEED_MIN) x = x < 0 ? -YSPEED_MIN : YSPEED_MIN;
    return { x: x, y: y };
  }

  @SubscribeMessage('input')
  async inputPlayer(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    if (!data.game_id)
      return;
    if (!this.stats.has(data.game_id))
      return;
    const tmp = this.stats.get(data.game_id);
    const value = data.value * 5;
    if (tmp.first_socket == client.id)
    {
      if (tmp.first + value < -50 + this.paddle.HEIGHT / 2)
        this.stats.set(data.game_id, {...tmp, first: -50 + this.paddle.HEIGHT / 2});
      else if (tmp.first + value > 50 - this.paddle.HEIGHT / 2)
        this.stats.set(data.game_id, {...tmp, first: 50 - this.paddle.HEIGHT / 2});
      else
        this.stats.set(data.game_id, {...tmp, first: tmp.first + value});
    }
    else if (tmp.second_socket == client.id)
    {
      if (tmp.second + value < -50 + this.paddle.HEIGHT / 2)
        this.stats.set(data.game_id, {...tmp, second: -50 + this.paddle.HEIGHT / 2});
      else if (tmp.second + value > 50 - this.paddle.HEIGHT / 2)
        this.stats.set(data.game_id, {...tmp, second: 50 - this.paddle.HEIGHT / 2});
      else
        this.stats.set(data.game_id, {...tmp, second: tmp.second + value});
    }
  }

  async playerLoses(socketID: string) {
    const sock = await this.getSocket(socketID);
    if (sock) sock.emit('lose');
  }

  async playerWins(socketID: string) {
    const sock = await this.getSocket(socketID);
    if (sock) sock.emit('win');
  }
}
