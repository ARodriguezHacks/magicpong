var startBtn = document.getElementById("startGame");
var canvas = document.getElementById("myCanvas");
let playerScore = 0;
let computerScore = 0;

var modal = document.getElementById("modalArea");

var openModal = document.getElementById("myBtn");

var startBtn = document.getElementById("startGame");

class Paddle {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.vx = 5;
    this.vy = 2;
  }
}

class Player extends Paddle {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.name = "Player";
  }
}

class Computer extends Paddle {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.name = "Computer";
  }
}

class Ball {
  constructor(radius, startAngle, endAngle) {
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.x = 500;
    this.y = 305;
    this.vx = 5;
    this.vy = -2;
  }
}

Paddle.prototype.move = function move(speed) {
  this.speed = speed;
  this.y += this.speed;
};

Player.prototype.render = function render() {
  var playerCanvas = document.getElementById("myCanvas");
  var playerContext = playerCanvas.getContext("2d");
  playerContext.fillStyle = "#fff";
  playerContext.fillRect(this.x, this.y, this.width, this.height);
  playerContext.closePath();
};

Computer.prototype.render = function render() {
  var computerCanvas = document.getElementById("myCanvas");
  var computerContext = computerCanvas.getContext("2d");
  computerContext.fillStyle = "#fff";
  computerContext.fillRect(this.x, this.y, this.width, this.height);
  computerContext.closePath();
};

Computer.prototype.update = function update(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  var left_x = ball.x - 50;
  var right_x = ball.x + 50;
  var top_y = ball.y - 50;
  var bottom_y = ball.y + 50;

  if (
    top_y < canvas.height / 2 &&
    left_x > this.x + this.width &&
    right_x < canvas.width / 2
  ) {
    if (this.y > 0) {
      this.move(-5);
    } else if ((this.y + this.height) / 2 <= 305) {
      this.move(5);
    }
  } else if (
    bottom_y > canvas.height / 2 &&
    left_x > this.x + this.width &&
    right_x < canvas.width / 2
  ) {
    if ((this.y + this.height) / 2 > 305) {
      this.move(-5);
    } else if (this.y < 460) {
      this.move(5);
    }
  }
};

Player.prototype.update = function update(amount) {
  this.move(amount);
};

Ball.prototype.render = function render() {
  var ballCanvas = document.getElementById("myCanvas");
  var ballContext = ballCanvas.getContext("2d");
  ballContext.beginPath();
  ballContext.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
  ballContext.fillStyle = "#fff";
  ballContext.fill();
  ballContext.closePath();
};

Ball.prototype.update = function update() {
  this.x += this.vx;
  this.y += this.vy;
};

Ball.prototype.stop = function stop() {
  this.vx = 0;
  this.vy = 0;
};

Ball.prototype.move = function move() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 1000, 610);
  render();

  var playerScoreTotal = document.getElementById("playerSide");
  playerScoreTotal.innerHTML = playerScore;
  var computerScoreTotal = document.getElementById("computerSide");
  computerScoreTotal.innerHTML = computerScore;

  var winMessage = document.getElementById("winMessage");
  var restartMessage = document.getElementById("restartMessage");

  var num = Math.floor(Math.random() * 7) + 1;
  num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

  if (this.y + this.vy > canvas.height - 35 || this.y + this.vy < 35) {
    this.vy = -this.vy;
  }

  if (playerScore === 10) {
    this.stop();
    winMessage.style.visibility = "visible";
    restartMessage.style.visibility = "visible";
    playerScore = 0;
    playerScoreTotal.innerHTML = playerScore;
    computerScore = 0;
    computerScoreTotal.innerHTML = computerScore;
  } else if (computerScore === 10) {
    this.stop();
    winMessage.innerHTML = "You lost...";
    winMessage.style.visibility = "visible";
    restartMessage.style.visibility = "visible";
    playerScore = 0;
    playerScoreTotal.innerHTML = playerScore;
    computerScore = 0;
    computerScoreTotal.innerHTML = computerScore;
  }

  if (this.x + this.vx > canvas.width) {
    computerScore += 1;
    computerScoreTotal.innerHTML = computerScore;
    this.x = 500;
    this.y = 305;
    this.vx = num;
    this.vy = num;
  } else if (this.x + this.vx < 0) {
    playerScore += 1;
    playerScoreTotal.innerHTML = playerScore;
    this.x = 500;
    this.y = 305;
    this.vx = num;
    this.vy = num;
  }
};

function collision(ball, player, computer) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  var left_x = ball.x - 25;
  var right_x = ball.x + 25;
  var top_y = ball.y - 25;
  var bottom_y = ball.y + 25;

  if (ball.vx > 0) {
    if (
      left_x < player.x + player.width &&
      right_x > player.x &&
      top_y < player.y + player.height &&
      bottom_y > player.y
    ) {
      ball.vx = -ball.vx;
      ball.vy += player.vy / 2;
      ball.x += ball.vx;
    }
  } else {
    if (
      left_x < computer.x + computer.width &&
      right_x > computer.x &&
      top_y < computer.y + computer.height &&
      bottom_y > computer.y
    ) {
      ball.vx = -ball.vx;
      ball.vy += computer.vy / 2;
      ball.x += ball.vx;
    }
  }
}

var player = new Player(930, 25, 20, 150);
var computer = new Computer(50, 25, 20, 150);
var ball = new Ball(25, 0, 2 * Math.PI);

const render = () => {
  player.render();
  computer.render();
  ball.render();
};

function startGameBox() {
  render();
  window.setTimeout(start, 1 * 1000, "Click below to start game.");
}

var start = function () {
  modal.style.display = "block";
};

startBtn.onclick = function () {
  modal.style.display = "none";
  animate(step);
};

var animate =
  window.requestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

function step() {
  animate(step);
  ball.update();
  ball.move();
  collision(ball, player, computer);
  computer.update(ball);
}

window.addEventListener("keydown", function (event) {
  const keyName = event.key;
  ctx = document.getElementById("myCanvas").getContext("2d");
  ctx.clearRect(0, 0, 1000, 610);
  if (keyName === "ArrowDown") {
    if (player.y < 460) {
      player.update(20);
    }
  } else if (keyName === "ArrowUp") {
    if (player.y > 0) {
      player.update(-20);
    }
  }
});

window.onload = startGameBox;
