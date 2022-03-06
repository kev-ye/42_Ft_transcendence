import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { GlobalConsts } from '../common/global';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.svg',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

	private gameStarted: boolean = false;
	fillColor = 'rgb(20, 20, 20)';

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

	ball = {
		x:          this.ball_t.X,
		y:          this.ball_t.Y,
		xIncrement: 0,
		yIncrement: 0,
	}

	player1 = {
		score: 0,
		x:     this.paddle.PADDING,
		y:     (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}

	player2 = {
		score: 0,
		x:     this.game.WIDTH - this.paddle.WIDTH - this.paddle.PADDING,
		y:     (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}

	mode: number = 0;
	//0 : play
	//1 : spectate
	

	constructor(private route: ActivatedRoute, private http: HttpClient) {
		// this.start()
	}

	sock: Socket;
	user: any;
	
	ngOnInit() : void {
		this.http.get(`${GlobalConsts.userApi}/user`).subscribe((data: any) => {
			this.user = data[0];
			console.log("received user data", data);
			
		});
		this.route.queryParams.subscribe((data: any)=> {
			this.mode = 0;
			if (data.id)
			{
				this.http.get(`${GlobalConsts.userApi}/game/custom/${data.id}`).subscribe({next: data => {
					if (!data)
						console.log("Game doesn't exist");
					else
					{
						
					}
				}})
			}
			else if (data.spec)
			{
				this.mode = 1;
				this.http.get(`${GlobalConsts.userApi}/game/custom/${data.spec}`).subscribe({next: data => {
					if (!data)
						console.log("Game doesn't exist");
				}})
			}

			this.sock = io(`/game`, {
				path: '/game/socket.io',
				withCredentials: true
			});
			this.sock.on('user', () => {
				console.log("emitting user", this.user);
								
				this.sock.emit('user', {id: this.user.id});
			});

			this.sock.on('joinedGame', () => {
				console.log("joinnneedGame");
			})
		})
		
	}

	ngOnDestroy(): void {
		this.route.queryParams.subscribe((data: any) => {
			if (data.id)
			{
				//this.http.delete
			}
		})
	}

	@HostListener("window:keydown", ["$event"])
  	onKeyDown(e: any) {
		  let threshold: number = 0
		  e.preventDefault();
		  
		  if (this.mode == 1)
		  	return ;
		  console.log("event", e);
		if (e.code == 'ArrowUp')
			this.sock.emit('input', {value: 1});
		else if (e.code == 'ArrowDown')
			this.sock.emit('input', {value: -1});
		else if (e.code == 'Space'){
			console.log("emit startMatchmaking");
			this.sock.emit('startMatchmaking');
		}
	}

	changeColor() : void {
		// avoid too bright colors
		const r = Math.floor((Math.random() * 256 - 30) % 256);
		const g = Math.floor((Math.random() * 256 - 30) % 256);
		const b = Math.floor((Math.random() * 256 - 30) % 256);
		this.fillColor = `rgb(${r}, ${g}, ${b})`;
		console.log(this.fillColor);		
	}
}
