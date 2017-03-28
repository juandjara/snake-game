(function(){

  var CELL_SIZE = 10;
  var ROWS = 40;
  var COLS = 40;

  var canvas = document.querySelector("canvas");
  var score_container = document.querySelector("#snake_score");
  var ctx = canvas.getContext("2d");

  var snake = {
    body: [],
    direction: "right"
  };
  var snakeInitialLength = 3;
  var food = {
    x: COLS/2,
    y: ROWS/2,
  };
  var score = 0;
  var grid = [[], []];

  var fps = 10;
  var frameDuration = 1000 / fps;

  var timer = null;

  function init() {
    initSnake(snakeInitialLength);
    score_container.innerHTML = getScore();
    initGrid();

    food = createFood();
    update();
    //timer = setInterval(update, frameDuration);
  }

  window.start_snake = function startGameLoop() {
    if(!timer) {
      timer = setInterval(update, frameDuration);
    }
  }
  window.pause_snake = function pauseGaneLoop() {
    clearInterval(timer);
    timer = null;
  }

  function initSnake(initialLength) {
    snake.body = [];
    snake.direction = "right";
    for(var i = 0; i < initialLength; i++) {
      snake.body.push({ x:i, y:1 })
    }
  }

  function initGrid() {
    // fill ROWS x COLS array wih color strings (css or hex)
    grid = Array(ROWS).fill(Array(COLS).fill("white"));
  }

  function randomIntInRange(start, end) {
    var size = end - start;
    return Math.floor(start + (Math.random() * size));
  }

  function randomFood() {
    return {
      x: randomIntInRange(0, COLS),
      y: randomIntInRange(0, ROWS)
    }
  }

  function foodIsValid(food) {
    return snake.body.filter(point => {
      return point.x === food.x && point.y === food.y;
    }).length === 0;
  }

  function createFood() {
    var food = randomFood();
    while(!foodIsValid(food)) {
      food = randomFood();
    }
    return food;
  }

  function drawCell(x,y, color, borderColor) {
    ctx.fillStyle = color;
    ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    if(borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, COLS*CELL_SIZE, ROWS*CELL_SIZE);

    snake.body.forEach(point => drawCell(point.x, point.y, "green", "limegreen"));
    drawCell(food.x, food.y, "red");
  }

  function checkBorderCollision() {
    var collision = snake.body.filter(point => {
      return point.x < 0 ||
             point.y < 0 ||
             point.x > COLS ||
             point.y > ROWS;
    }).length > 0;
    return collision;
  }

  function checkSelfCollision() {
    var head = snake.body.slice(-1)[0];
    var body = snake.body.slice(0, -1);
    var collision = body.filter(point => {
      return point.x === head.x && point.y === head.y;
    }).length > 0;
    return collision;
  }

  function gameover() {
    clearInterval(timer);
    timer = null;
    alert(`GAME OVER. Has conseguido ${getScore()} puntos`);
  }

  function getScore() {
    return snake.body.length - snakeInitialLength;
  }

  function getFood() {
    return !foodIsValid(food);
  }

  function update() {
    var foundFood = getFood();

    var tail = snake.body.shift(); // remove tail block

    if(foundFood) {
      snake.body.unshift(tail);
      food = createFood();
      score_container.innerHTML = getScore();
    }

    var head = snake.body[snake.body.length - 1];
    var newHead = moveCell(head, snake.direction)
    snake.body.push(newHead);

    if(checkBorderCollision() || checkSelfCollision()) {
      gameover();
      init();
      return;
    }

    draw();
  }

  function keyInput(ev) {
    var keyCode = ev.which || ev.keyCode;
    var keyMap = {
      '37': 'left',  // left arrow
      '38': 'up',    // up arrow
      '39': 'right', // right arrow
      '40': 'down',  // down arrow
      '87': 'up',    // w
      '65': 'left',  // a
      '83': 'down',  // s
      '68': 'right'  // d
    }
    var newDirection = keyMap[keyCode];
    if(newDirection) {
      moveSnake(newDirection);
    }
  }

  window.moveSnake = function moveSnake(newDirection) {
    var directionInverseMap = {
      'left':  'right',
      'right': 'left',
      'up':    'down',
      'down':  'up'
    }
    var oppositeDirection = directionInverseMap[newDirection];

    if(snake.direction !== oppositeDirection) {
      snake.direction = newDirection;
    }
  }

  function moveCell(cell, direction) {
    switch(direction) {
      case 'left':
        return {
          x: cell.x - 1,
          y: cell.y
        }
      case 'right':
        return {
          x: cell.x + 1,
          y: cell.y
        }
      case 'up':
        return {
          x: cell.x,
          y: cell.y - 1
        }
      case 'down':
        return {
          x: cell.x,
          y: cell.y + 1
        }
      default:
        return cell;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('keydown', keyInput);

})();
