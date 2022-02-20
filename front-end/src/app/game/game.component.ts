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
		y: 0
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
		x: 0,
		y: (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}

	player2 = {
		score: 0,
		x: this.game.WIDTH - this.paddle.WIDTH,
		y: (this.game.HEIGHT / 2) - (this.paddle.HEIGHT / 2)
	}

	constructor() {
		this.start();
		// this.game = new Game()
		// this.game.start()
		// requestAnimationFrame(game.step)
	}
	
	ngOnInit(): void {
		// this.game = new Game(this.gameCanvas)
		// this.game.context.fillStyle = "#fff"
		// this.game.context.fillRect(this.gameCanvas.width / 2 - 10, 10, 15, 20)
		// this.game.start()
	}
	
	start() {
		this.resetBall()
		
		const move_x = this.ball_t.SPEED * (Math.random() < 0.5 ? -1 : 1)
		const move_y = this.ball_t.SPEED * (Math.random() < 0.5 ? -1 : 1)

		window.requestAnimationFrame(() => this.moveBall(move_x, move_y));
	}

	@HostListener("window:keydown", ["$event"])
  	onKeyDown(e: any) {
		if (e.code === "ArrowUp") {
			window.requestAnimationFrame(() => this.movePaddle(-this.paddle.SPEED));
		}
		if (e.code === "ArrowDown") {
			window.requestAnimationFrame(() => this.movePaddle(this.paddle.SPEED));
		}
	}

	movePaddle(threshold: number) {
		if (this.player1.y + threshold >= 0 &&
			this.player1.y + threshold + this.paddle.HEIGHT <= this.game.HEIGHT) {
			this.player1.y += threshold
		}
	}

	private resetBall() {
		this.ball.x = this.ball_t.X
		// this.ball.y = this.ball_t.Y
		this.ball.y = Math.random() * this.game.HEIGHT
	}

	moveBall(xIncrement: number, yIncrement: number) {
		const x_test = this.ball.x + xIncrement + this.ball_t.RADIUS
		const y_test = this.ball.y + yIncrement + this.ball_t.RADIUS

		if (x_test > 0 && x_test < this.game.WIDTH + this.ball_t.SPEED)
			this.ball.x += xIncrement
		else
		{
			xIncrement = -xIncrement
			this.ball.x += xIncrement
		}

		if (y_test > 0 && y_test < this.game.HEIGHT + this.ball_t.SPEED)
			this.ball.y += yIncrement
		else
		{
			yIncrement = -yIncrement
			this.ball.y += yIncrement
		}

		window.requestAnimationFrame(() => this.moveBall(xIncrement, yIncrement));
	}
}


// enum KeyBindings {
// 	UP   = 38,
// 	DOWN = 40
// }

// interface EntityDto {
// 	canvas : any
// 	context : any
// 	width : number
// 	height : number
// 	x : number
// 	y : number
// }

// class Game {
// 	private game : any
// 	public static keysPressed : boolean[] = []
// 	public static playerScore : number = 0
// 	public static computerScore : number = 0
// 	private player1 : Paddle
// 	private computerPlayer : ComputerPaddle
// 	private ball : Ball

// 	constructor(gameCanvas : any) {
// 		console.log(gameCanvas)
// 		this.game.canvas = gameCanvas
// 		this.game.context = this.game.canvas.getContext("2d")
// 		// this.game.context.font = "30px Orbitron"
		

// 		window.addEventListener("keydown", e => {
// 			Game.keysPressed[e.which] = true
// 			// TODO: event on backend
// 		})
		
// 		window.addEventListener("keyup", function(e) {
// 			Game.keysPressed[e.which] = false
// 			// TODO: event on backend
// 		})
		

// 		const PADDLE_WIDTH : number = 20
// 		const PADDLE_HEIGHT : number = 60
// 		const BALL_SIZE : number = 10
// 		const WALL_OFFSET : number = 20
		
// 		this.player1 = new Paddle({
// 			...this.game,
// 			width: PADDLE_WIDTH,
// 			height: PADDLE_HEIGHT,
// 			x: WALL_OFFSET,
// 			y: this.game.canvas.height / 2 - PADDLE_HEIGHT / 2
// 		}) 
		
// 		this.computerPlayer = new ComputerPaddle({
// 			...this.game,
// 			width: PADDLE_WIDTH,
// 			height: PADDLE_HEIGHT,
// 			x: this.game.canvas.width - (WALL_OFFSET + PADDLE_WIDTH),
// 			y: this.game.canvas.height / 2 - PADDLE_HEIGHT / 2
// 		})
		
// 		this.ball = new Ball({
// 			...this.game,
// 			width: BALL_SIZE,
// 			height: BALL_SIZE,
// 			x: this.game.canvas.width / 2 - BALL_SIZE / 2,
// 			y: this.game.canvas.height / 2 - BALL_SIZE / 2
// 		})
// 	}

// 	drawBoardDetails() {
// 		// draw court outline
// 		this.game.context.strokeStyle = "#fff"
// 		this.game.context.lineWidth = 5
// 		this.game.context.strokeRect(10, 10, this.game.canvas.width - 20, this.game.canvas.height - 20)
		
// 		// draw center lines
// 		for (let i = 0; i + 30 < this.game.canvas.height; i += 30) {
// 			this.game.context.fillStyle = "#fff"
// 			this.game.context.fillRect(this.game.canvas.width / 2 - 10, i + 10, 15, 20)
// 		}
		
// 		// draw scores
// 		this.game.context.fillText(Game.playerScore, 280, 50)
// 		this.game.context.fillText(Game.computerScore, 390, 50)
		
// 	}

// 	update() {
// 		this.player1.update()
// 		this.computerPlayer.update(this.ball)
// 		this.ball.update(this.player1, this.computerPlayer)
// 	}

// 	draw() {
// 		this.game.context.fillStyle = "#000"
// 		this.game.context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

// 		this.drawBoardDetails()
// 		this.player1.draw(this.game.context)
// 		this.computerPlayer.draw(this.game.context)
// 		this.ball.draw(this.game.context)
// 	}

// 	step() {
// 		this.update()
// 		this.draw()
// 		requestAnimationFrame(this.step)
// 	}

// 	start() {
// 		requestAnimationFrame(this.step) //
// 		while (1) {
// 			console.log('ef')
// 			this.step()
// 		}
// 	}
// }

// class Entity {
// 	canvas : any
// 	context : any
// 	width : number
// 	height : number
// 	x : number
// 	y : number
// 	xVel : number = 0
// 	yVel : number = 0

// 	constructor(newEntity : EntityDto) {
// 		this.canvas = newEntity.canvas
// 		this.context = newEntity.context
// 		this.width = newEntity.width
// 		this.height = newEntity.height
// 		this.x = newEntity.x
// 		this.y = newEntity.y
// 	}

// 	draw(context : any) { //
// 		this.context.fillStyle = "#fff"
// 		this.context.fillRect(this.x, this.y, this.width, this.height)
// 	}
// }

// class Paddle extends Entity {
	
// 	private SPEED : number = 10
	
// 	constructor(entity : EntityDto) {
// 		super(entity)
// 	}
	
// 	update() {
// 		if (Game.keysPressed[KeyBindings.UP]) {
// 			this.yVel = -1
// 			if (this.y <= 20) {
// 				this.yVel = 0
// 			}
// 		} else if (Game.keysPressed[KeyBindings.DOWN]) {
// 			this.yVel = 1
// 			if (this.y + this.height >= this.canvas.height - 20) {
// 				this.yVel = 0
// 			}
// 		} else {
// 			this.yVel = 0
// 		}
// 		this.y += this.yVel * this.SPEED
// 	}
// }

// class ComputerPaddle extends Entity {
	
// 	private SPEED : number = 10
	
// 	constructor(entity : EntityDto) {
// 		super(entity)
// 	}
	
// 	update(ball : Ball) { 
// 		// chase ball
// 		if (ball.y < this.y && ball.xVel == 1) {
// 			this.yVel = -1 
// 			if (this.y <= 20)
// 				this.yVel = 0
// 		} else if (ball.y > this.y + this.height && ball.xVel == 1) {
// 			this.yVel = 1
// 			if (this.y + this.height >= this.canvas.height - 20)
// 				this.yVel = 0
// 		} else {
// 			this.yVel = 0
// 		}
// 		this.y += this.yVel * this.SPEED
// 	}
// }

// class Ball extends Entity {
	
// 	private SPEED : number = 5
	
// 	constructor(entity : EntityDto) {
// 		super(entity)
		
// 		let randomDirection = Math.floor(Math.random() * 2) + 1
// 		if (randomDirection % 2) {
// 			this.xVel = 1
// 		} else {
// 			this.xVel = -1
// 		}
// 		this.yVel = 1
// 	}
	
// 	update(player : Paddle, computer : ComputerPaddle) {
	
// 		//check top canvas bounds
// 		if (this.y <= 10) {
// 			this.yVel = 1
// 		}
		
// 		//check bottom canvas bounds
// 		if (this.y + this.height >= this.canvas.height - 10) {
// 			this.yVel = -1
// 		}
		
// 		//check left canvas bounds
// 		if (this.x <= 0) {  
// 			this.x = this.canvas.width / 2 - this.width / 2
// 			Game.computerScore++
// 		}
		
// 		//check right canvas bounds
// 		if (this.x + this.width >= this.canvas.width) {
// 			this.x = this.canvas.width / 2 - this.width / 2
// 			Game.playerScore++
// 		}
		
		
// 		//check player collision
// 		if (this.x <= player.x + player.width) {
// 			if (this.y >= player.y && this.y + this.height <= player.y + player.height) {
// 				this.xVel = 1
// 			}
// 		}
		
// 		//check computer collision
// 		if (this.x + this.width >= computer.x) {
// 			if (this.y >= computer.y && this.y + this.height <= computer.y + computer.height) {
// 				this.xVel = -1
// 			}
// 		}
	
// 		this.x += this.xVel * this.SPEED
// 		this.y += this.yVel * this.SPEED
// 	}
// }
