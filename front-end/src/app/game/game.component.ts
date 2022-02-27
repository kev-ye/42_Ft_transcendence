import { Component, HostListener, Inject, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.svg',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	game = {
		WIDTH:  700,
		HEIGHT: 400
	}

	paddle = {
		WIDTH:  10,
		HEIGHT: 100,
		PADDING: 10,
		RADIUS: 3,
		SPEED: 10
	}
	
	ball_t = {
		RADIUS: 7,
		SPEED: 4,
		X: this.game.WIDTH / 2,
		Y: this.game.HEIGHT / 2
	}

	ball = {
		x: 0,
		y: 0,
		xIncrement: 0,
		yIncrement: 0,
	}

	score1 = {
		x: this.game.WIDTH / 2 - 60,
		y: 40
	}

	score2 = {
		x: this.game.WIDTH / 2 + 20,
		y: 40
	}

	player1 = {
		score: 0,
		x: this.paddle.PADDING,
		y: (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}

	player2 = {
		score: 0,
		x: this.game.WIDTH - this.paddle.WIDTH - this.paddle.PADDING,
		y: (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}
	

	constructor() {
		this.start()
	}
	
	ngOnInit() : void {

	}

	resetBall() : void {
		this.ball.x = this.ball_t.X
		this.ball.y = Math.random() * this.game.HEIGHT
		this.ball.xIncrement = this.ball_t.SPEED * (Math.random() < 0.5 ? -1 : 1)
		this.ball.yIncrement = this.ball_t.SPEED * (Math.random() < 0.5 ? -1 : 1)
	}
	
	start() : void {
		this.resetBall()
		window.requestAnimationFrame(() => this.moveBall());
	}

	@HostListener("window:keydown", ["$event"])
  	onKeyDown(e: any) {
		let threshold: number = 0
		
		if (e.code === "ArrowUp") {
			threshold = -this.paddle.SPEED
		}
		if (e.code === "ArrowDown") {
			threshold = this.paddle.SPEED
		}

		/* animation was too slow - had to do this trick */
		let val: number = threshold < 0 ? -1 : 1
		for (let _ = Math.abs(threshold); _ > 0; --_) {
			this.movePaddle(val)
			setTimeout(() => {
				window.requestAnimationFrame(() => this.movePaddle(val))
			}, 10)
		}
		// window.requestAnimationFrame(() => this.movePaddle(threshold));
	}

	movePaddle(val: number) : void {
		if (this.player1.y + val >= 0 &&
			this.player1.y + val + this.paddle.HEIGHT <= this.game.HEIGHT) {
			this.player1.y += val
		}
	}

	goalCollision(x: number) : boolean {
		if (x < -this.ball_t.RADIUS)
		{
			this.player2.score++
			return true
		}
		else if (x > (this.game.WIDTH + this.ball_t.RADIUS))
		{
			this.player1.score++
			return true
		}
		else
			return false;
	}

	wallCollision(y: number) : boolean {
		return y <= this.ball_t.RADIUS ||
			   y >= (this.game.HEIGHT - this.ball_t.RADIUS)
	}

	paddleCollision(x: number, y: number) : boolean {

		// check if the ball is aligned with one of the paddle
		const rightPaddleCollision: boolean = 
			y >= this.player1.y &&
			y <= (this.player1.y + this.paddle.HEIGHT);

		const leftPaddleCollision: boolean =
			y >= this.player2.y &&
			y <= (this.player2.y + this.paddle.HEIGHT);
		
		/*
			check if the ball is in the paddle area,
			and that the ball is actually in front of the corresponding paddle.
			(means that we have to bounce it)
		*/
		const rightCollision: boolean = 
			   x - (this.paddle.PADDING + this.paddle.WIDTH) < 0 &&
			this.ball.x - (this.paddle.PADDING + this.paddle.WIDTH) > 0 &&
			rightPaddleCollision;

		const leftCollision: boolean =
			   x + (this.paddle.PADDING + this.paddle.WIDTH) > this.game.WIDTH &&
			this.ball.x + (this.paddle.PADDING + this.paddle.WIDTH) < this.game.WIDTH &&
			leftPaddleCollision;

		return rightCollision || leftCollision
	}

	moveBall() : void {
		const future_x: number = this.ball.x + this.ball.xIncrement
		const future_y: number = this.ball.y + this.ball.yIncrement

		if (this.goalCollision(future_x))
		{
			// the ball has hit a border, giving a point to the other player
			this.resetBall()
		}
		else
		{
			// bounce off the paddles
			if (this.paddleCollision(future_x, future_y))
				this.ball.xIncrement = -this.ball.xIncrement
			
			// bounce off top and bottom walls
			if (this.wallCollision(future_y))
				this.ball.yIncrement = -this.ball.yIncrement
	
			this.ball.x += this.ball.xIncrement
			this.ball.y += this.ball.yIncrement
		}

		window.requestAnimationFrame(() => this.moveBall());
	}
}
