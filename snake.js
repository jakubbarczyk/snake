const gridSize = 400;
const tileSize = 20;
const intervals = [];
const fps = 4;

const Direction = {
  Up: "↑",
  Right: "→",
  Down: "↓",
  Left: "←",
};

for (let i = tileSize / 2; i < gridSize; i += tileSize) {
  intervals.push(i);
}

function randomPoint() {
  const low = 10;
  const high = 390;
  // p5's random function cannot be used outside of setup or draw function
  const index = Math.floor(Math.random() * intervals.length);

  return intervals[index];
}

function createApple() {
  return {
    x: randomPoint(),
    y: randomPoint(),
    draw() {
      const { x, y } = this;
      // The fruit
      fill("red");
      stroke("darkred");
      ellipse(x, y, tileSize - 2, tileSize - 4);
      // The leaves
      noStroke();
      fill("darkgreen");
      quad(x, y - 4, x - 2, y - 8, x, y - 10, x + 2, y - 8);
      fill("green");
      quad(x, y - 4, x + 3, y - 8, x + 7, y - 8, x + 5, y - 4);
    },
    replace() {
      this.x = randomPoint();
      this.y = randomPoint();
    },
  };
}

function createSnake(x, y) {
  return {
    x,
    y,
    tail: [],
    velocity: tileSize,
    xVelocity: 0,
    yVelocity: 0,
    direction: null,
    draw() {
      // The snake's head
      noStroke();
      fill("lime");
      rectMode(CENTER);
      rect(
        this.x + this.xVelocity,
        this.y + this.yVelocity,
        tileSize,
        tileSize
      );

      // The snake's tail
      this.tail.shift();
      this.tail.push({ x: this.x, y: this.y });

      for (let position of this.tail) {
        rect(position.x, position.y, tileSize, tileSize);
      }

      this.x += this.xVelocity;
      this.y += this.yVelocity;
    },
    extend() {
      this.tail.push({ x: this.x, y: this.y });
    },
    moveUp() {
      this.xVelocity = 0;
      this.yVelocity = -this.velocity;
      this.direction = Direction.Up;
    },
    moveRight() {
      this.xVelocity = +this.velocity;
      this.yVelocity = 0;
      this.direction = Direction.Right;
    },
    moveDown() {
      this.xVelocity = 0;
      this.yVelocity = +this.velocity;
      this.direction = Direction.Down;
    },
    moveLeft() {
      this.xVelocity = -this.velocity;
      this.yVelocity = 0;
      this.direction = Direction.Left;
    },
    stop() {
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.direction = null;
    },
  };
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      snake.moveUp();
      break;
    case RIGHT_ARROW:
      snake.moveRight();
      break;
    case DOWN_ARROW:
      snake.moveDown();
      break;
    case LEFT_ARROW:
      snake.moveLeft();
      break;
  }

  return false;
}

function createScoreboard(score = 0) {
  return {
    score,
    draw() {
      fill("yellow");
      textAlign(CENTER, BOTTOM);
      textSize(tileSize);
      text(this.score, gridSize / 2, gridSize);
    },
    increment(n = 1) {
      this.score += n;
    },
    decrement(n = 1) {
      this.score -= n;
    },
  };
}

function createNotification() {
  return {
    message: "",
    draw() {
      fill("magenta");
      textAlign(CENTER, BOTTOM);
      textSize(tileSize * 2);
      text(this.message, gridSize / 2, gridSize / 2);
    },
    set(message) {
      this.message = message;
    },
  };
}

const apple = createApple();
const snake = createSnake(10, 10);
const scoreboard = createScoreboard();
const notification = createNotification();

function collisionDetected() {
  return (
    (snake.x < tileSize && snake.direction === Direction.Left) ||
    (snake.y < tileSize && snake.direction === Direction.Up) ||
    (snake.x > gridSize - tileSize && snake.direction === Direction.Right) ||
    (snake.y > gridSize - tileSize && snake.direction === Direction.Down)
  );
}

function setup() {
  createCanvas(gridSize, gridSize);
  frameRate(fps);
}

function draw() {
  background("black");

  if (collisionDetected()) {
    snake.stop();
    notification.set("YOU HAVE LOST!");
  }

  if (dist(snake.x, snake.y, apple.x, apple.y) < tileSize) {
    apple.replace();
    snake.extend();
    scoreboard.increment(10);
  }

  apple.draw();
  snake.draw();
  scoreboard.draw();
  notification.draw();
}
