//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var size = 20;
var w = 20;
var h = 20;
c.width = w*size;
c.height = h*size;

//innitial game set up
function preGame(){
  document.getElementById("resetButton").hidden = true;
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.fillRect(0,0,c.width,c.height);
  ctx.font = "30px 'Patrick Hand SC'";
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.fillText("Hello World",10,50);
  Dir = [[1,0]];
  Points = 0;
  document.getElementById("points").innerText = "Points: " + Points;
  snake = [[1,3]];
  Apples = [];
  tail = [];
  Apple();
  Apple();
  Apple();
  startGame();
}

//the game loop
function startGame() {
  tail = Array.from(snake[snake.length - 1]);
  for(var i=snake.length-1; i>=0; i--){
    if(i!=0){
     snake[i][0] = snake[i-1][0];
     snake[i][1] = snake[i-1][1];
    }
  }
  if(Dir.length>1) Dir.shift()
  snake[0][0]+=Dir[0][0];
  snake[0][1]+=Dir[0][1];
  if (Apples.find(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]) != undefined){
    Apples.splice(Apples.findIndex(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]),1);
    Points++;
    document.getElementById("points").innerText = "Points: " + Points;
    snake.push(tail);
    Apple();
  } else cleanUp();
  ctx.fillStyle = "rgb(60,150,90)";
  for(var i=0; i<snake.length; i++){
    var head = ctx.fillRect(snake[i][0]*size, snake[i][1]*size, size, size);
  ctx.fillStyle = "rgb(120,200,50)";
  }
  if(snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h||snake.slice(1).find(part => part[0] == snake[0][0] && part[1] == snake[0][1]) != undefined){
    ctx.fillStyle = "red";
    ctx.fillText("game over",150,180);
    document.getElementById("resetButton").hidden = false;
    return;
  }
  //tick rate
  setTimeout(startGame, 100);
}

function Clock() {
  const today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =  h + ":" + m + ":" + s;
  setTimeout(Clock, 1000);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function cleanUp() {
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.fillRect(tail[0]*size, tail[1]*size, size, size);
}

function Apple(){
  do {
    var xRand = Math.floor(Math.random() * w);
    var yRand = Math.floor(Math.random() * h);
  } while(snake.find(part => part[0] == xRand && part[1] == yRand) != undefined)
  Apples.push([xRand, yRand]);
  ctx.fillStyle = "red";
  ctx.fillRect(xRand*size,yRand*size,size,size);
}

window.addEventListener("keydown", function (event) {
if (event.defaultPrevented) {
  return; // Do nothing if the event was already processed
}

switch (event.key) {
  case "ArrowDown":
    if(Dir[0][1]!=-1){
      Dir.push([0,1]);
    }
    break;
  case "ArrowUp":
  if(Dir[0][1]!=1){
      Dir.push([0,-1]);
    }
    break;
  case "ArrowLeft":
  if(Dir[0][0]!=1){
      Dir.push([-1,0]);
    }
    break;
  case "ArrowRight":
  if(Dir[0][0]!=-1){
      Dir.push([1,0]);
    }
    break;
  default:
    return; // Quit when this doesn't handle the key event.
}

// Cancel the default action to avoid it being handled twice
event.preventDefault();
}, true);
// the last option dispatches the event to the listener first, then dispatches event to window
