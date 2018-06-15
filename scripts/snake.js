/**Program Name:       	  snake.js
 * Developer:             Vahid Sheigani
 * Date Developed:      	April 4, 2017
 * Date uploaded:         June 14, 2017
*/


/** Purpose: Snake game developed using simple javascript
            concepts and basic methods. Developed on the base of
            Vingesh post in the the following link:
            https://codereview.stackexchange.com/questions/55323/snake-game-with-canvas-element-code
            with Major changes and so many features added
*/

var speed, score, oldDirection, direction, blockSize, isClicked, pos, scoreCount,control,playBtn,gameStatus;
var keys = {};
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var dotPos = [Math.round(Math.random(4)*(canvas.width - 10)), Math.round(Math.random(4)*(canvas.height - 10))];
var dotPos2 = [Math.round(Math.random(4)*(canvas.width - 10)), Math.round(Math.random(4)*(canvas.height - 10))];
var x = document.getElementById('soundTrack');
lbwarn = document.getElementById('lbwarn');
lbwarn.style.visibility = 'hidden';
var ic = 0;
var labletm;

window.onload = function(){
  startGame();
}

window.onkeydown = function(event){
  var code = event.keyCode;
  direction = keys[code];
  if(direction)
  {
    changeDirection(direction);
    event.preventDefault();
  }
};

function changeSpeed(){ //changes snake movement speed.
  var tempspeed = parseInt(document.getElementById('speedTxt').value);
  if(Number.isInteger(tempspeed) && tempspeed>=1 && tempspeed<=250){
    speed = tempspeed;
  }else{
    document.getElementById('speedTxt').value = speed;
    showHide();
  }
}

function drawSnake(){ //draws snake block.
  for(var i = 0; i < pos.length; i++)
  {
    drawSnakeBlock(pos[i]);
  }
}

function moveSnake(){ //basic linear/horizontal movement of the snake, also die if you hit yourself
  var nextPosition = pos[0].slice();
  for (z = 1; z<pos.length;z++){
    if (nextPosition[0] == pos[z][0] && nextPosition[1] == pos[z][1]){
      gameOver();
    }
  }
  switch(oldDirection)
  {
    case 'right':
    nextPosition[0] += 1;
    break;
    case 'left':
    nextPosition[0] -= 1;
    break;
    case 'up':
    nextPosition[1] -= 1;
    break;
    case 'down':
    nextPosition[1] += 1;
    break;
  }

  pos.unshift(nextPosition);
  pos.pop();
}

function growSnake(){ //grows a block of snake.

  var nextPosition = pos[0].slice();
  switch(oldDirection)
  {
    case 'right':
    nextPosition[0] += 1;
    break;
    case 'left':
    nextPosition[0] -= 1;
    break;
    case 'up':
    nextPosition[1] -= 1;
    break;
    case 'down':
    nextPosition[1] += 1;
    break;
  }
  pos.unshift(nextPosition);
}

function gameLoop()
{ //loops the game calling functions over and over.
  try{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
    moveSnake();
    dotAppear();
    dotAppear2();
    if(isHit(pos[0][0]*blockSize,pos[0][1]*blockSize,blockSize,dotPos[0],dotPos[1],20))
    {
      hitMusic();
      score += 10;
      if (score != 250)
      {
        createDotPos();
        scoreCount.innerHTML = score;

        growSnake();

        if(speed >= 20)
        {
          speed +=3.4;
        }
      }
      else{
        gameStatus = 0;
        victory();
        throw 'Won';
      }

    }
    if(isHit(pos[0][0]*blockSize,pos[0][1]*blockSize,blockSize,dotPos2[0],dotPos2[1],20))
    {
      hitMusic();
      score += 10;
      if (score != 250)
      {
        createDotPos2();
        scoreCount.innerHTML = score;

        growSnake();

        if(speed >= 20)
        {
          speed +=3.4;
        }
      }
      else{
        gameStatus = 0;
        victory();
        throw 'Won';
      }
    }
    myTime = parseInt(setTimeout(gameLoop,250-speed));
    gameStatus = 1;
  }
  catch(e){
  }
}

function changeDirection(direction){ //change direction of snake via ^V<> keys.
  var oppositeDirection = {
    left : 'right',
    right: 'left',
    up: 'down',
    down:'up'
  }
  if( direction != oppositeDirection[oldDirection] ){
    oldDirection = direction;
  }
}

function music(){ //Next 4 functions all play a type of music.
  x.play();
}

function hitMusic(){
  document.getElementById('hit').play();
}

function deathMusic(){
  document.getElementById('death').play();
}

function winMusic(){
  document.getElementById('win').play();
}

function dotAppear(){ //draws a red dot.
  ctx.beginPath();
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(dotPos[0],dotPos[1],20,20);
  ctx.fill();
  ctx.closePath();
}

function createDotPos(){ //decides the location of the red dot.
  dotPos = [Math.round(Math.random()*1760+20), Math.round(Math.random()*560 +20)];
}

function dotAppear2(){ //draws red dot #2.
  ctx.beginPath();
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(dotPos2[0],dotPos2[1],20,20);
  ctx.fill();
  ctx.closePath();
}

function createDotPos2(){ //decides the location of the second dot.
  dotPos2 = [Math.round(Math.random()*1760+20), Math.round(Math.random()*560 +20)];
}

function isHit(snakeX,snakeY,size,dotX,dotY,dotsize) { //Checks if snake has hit red dot.
  return !(
    ((snakeY + size) < (dotY)) ||
    (snakeY > (dotY + dotsize)) ||
    ((snakeX + size) < dotX) ||
    (snakeX > (dotX + dotsize))
  );
}

function gameOverShow(){ //stops all function and shows losing screen.
  playBtn.disabled='true';
  gameStatus=0;
  clearTimeout(myTime);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font='100px san-serif';
  ctx.fillText('Game Over',650,200);
  ctx.font = '80px san-serif';
  ctx.fillStyle='white';
  ctx.fillText('To Play again, Click the Restart button',330,350);
  throw 'Game Over';
}

function gameOver(){ //calls gameOverShow().
  x.pause();
  deathMusic();
  gameOverShow();
}

function drawSnakeBlock(pos){ //draws the snake, also die if you hit canvas wall.
  var x = pos[0] * blockSize;
  var y = pos[1] * blockSize;
  if(x >= canvas.width || x <= 0 || y >= canvas.height || y<= -10)
  {
    gameOver();
  }
  else
  {
    ctx.beginPath();
    ctx.strokeStyle="#ffff00";
    ctx.lineWidth = 4;
    ctx.strokeRect(x,y,blockSize,blockSize);
    ctx.closePath();
  }
}

function playPause(){ //pauses the game, resumes the game.

  if (isClicked == 0) {
    gameLoop();
    isClicked = 1;
    playBtn.value='Pause';
  }
  else {
    if(gameStatus == 1)
    {
      clearTimeout(myTime);
      gameStatus=0;
      playBtn.value='Play';

    }
    else
    {
      gameLoop();
      playBtn.value='Pause';
    }
  }
}

function restartGame(){ //restarts the game.
  location.reload(true);
}

function startGame(){ //draws the intro page of the game and sets basic values.
  ctx.fillStyle='#000000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "red";
  ctx.font='bold 80px Verdana';
  ctx.fillText('~ Snake Game ~',550,300);
  ctx.font='bold 40px Verdana';
  ctx.fillStyle = "white";
  ctx.fillText('-Collect the red dots to gain points, speed, and grow !',25,400);
  ctx.fillText('-Win by collecting a total of 250 points ~',25,460);
  ctx.fillText('-Avoid colliding with the walls or yourself or you will die ;(',25,520);
  ctx.fillText('-Use the ^ up, v down, < left, > right arrow keys to control snakes movement `',25,580);

  score = 0;
  oldDirection = 'right';
  direction = 'right';
  blockSize = 20;
  isClicked = 0;
  changeSpeed();
  pos = [[6,1],[5,1],[4,1],[3,1],[2,1],[1,1]];
  scoreCount = document.getElementById('scoreCount');
  control = document.getElementById('controls');
  playBtn = document.getElementById('playBtn');
  keys = {
    37 : 'left',
    38 : 'up',
    39 : 'right',
    40 : 'down'
  }
  gameStatus = 0;
}

function victory(){ //When the function is called, freezes any actions, texts is drawn and displays victory message.
  x.pause();
  winMusic();
  playBtn.disabled='true';
  clearTimeout(myTime);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font='100px san-serif';
  ctx.fillText('Congratulations ! You Beat the Game !',150,200);
  ctx.font = '80px san-serif';
  ctx.fillStyle='white';
  ctx.fillText('To Play again, Click the Restart button',330,350);
}

function showHide() { //shows warning message if player change speed above 250.
  if (ic<9){
    if(lbwarn.style.visibility == 'hidden'){
      lbwarn.style.visibility = 'visible';
      ic++;
      labletm = setTimeout(showHide,500);
    }
    else{

      lbwarn.style.visibility = 'hidden';
      ic++;
      labletm = setTimeout(showHide,500);
    }
  }
  if(ic == 9){
    lbwarn.style.visibility = 'hidden';
    clearInterval(labletm);
    ic = 0;
  }
}
