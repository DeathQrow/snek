//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var size = 20;
var w = 20;
var h = 20;
c.width = w*size;
c.height = h*size;

var fps = document.getElementById("fps");
var currentFrame = 0;
var lastFrame = 0;
var frameSkip = 0;
var state = 1;

//innitial game set up
function preGame(){
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.font = ((w*h)/(w+h)*5)+"px 'Patrick Hand SC'";
  ctx.clearRect(0,0,w*size,h*size);
  Dir = [[1,0]];
  DirMem = [[1,0]];
  Score = 0;
  state = 1;
  frameSkip = 0;
  document.getElementById("points").innerText = "Score: " + Score;
  snake = [[1,3]];
  tail = Array.from(snake[snake.length - 1]);
  Apples = [];
  Apple();
  Apple();
  Apple();
}

function Render(){
  const time = new Date();
  currentFrame = time[Symbol.toPrimitive]('number');
  fps.innerText = (1000/(currentFrame-lastFrame)).toFixed(2)+" fps";
  lastFrame = time[Symbol.toPrimitive]('number');
  if(state==1) {
    if(snake.length>1){
      ctx.fillStyle = "rgb(120,200,50)";
      ctx.fillRect(snake[0][0]*size, snake[0][1]*size, size, size);
    }
    ctx.fillStyle = "rgb(60,150,90)";
    if(Math.abs(Dir[0][1])!=1){
      ctx.fillRect((snake[0][0]+(Dir[0][0]*frameSkip/6))*size, snake[0][1]*size, size, size);
    } else if(Math.abs(Dir[0][0])!=1){
      ctx.fillRect(snake[0][0]*size, (snake[0][1]+(Dir[0][1]*frameSkip/6))*size, size, size);
    }
    cleanUp();
  }
  
  if(frameSkip >= 6 && state == 1) {
    gameLoop(); 
    
    frameSkip = 0;
  }
  frameSkip++;
  setTimeout(Render, 1000/60)
}

//the game loop
function gameLoop() {
  for(var i=snake.length-1; i>=0; i--){
    if(i!=0){
     snake[i][0] = snake[i-1][0];
     snake[i][1] = snake[i-1][1];
    }
  }
  snake[0][0]+=Dir[0][0];
  snake[0][1]+=Dir[0][1];
  if(DirMem.length+1>=snake.length) {
    DirMem.shift();
  }
  DirMem.push(Dir[0]);
  
  if (Apples.find(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]) != undefined){
    Apples.splice(Apples.findIndex(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]),1);
    Score++;
    document.getElementById("points").innerText = "Score: " + Score;
    snake.push(tail);
    Apple();
  }
  
  tail = Array.from(snake[snake.length - 1]);
  if(Dir.length>1) Dir.shift()

  //game over condition
  if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h||snake.slice(1).find(part => part[0] == snake[0][0] && part[1] == snake[0][1]) != undefined) && state == 1){
    const gradient = ctx.createRadialGradient(snake[0][0]*size+10, snake[0][1]*size+10, 15, snake[0][0]*size+10, snake[0][1]*size+10,40);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(snake[0][0]*size-40, snake[0][1]*size-40, 100, 100);
    if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h) && snake.length > 1){
      ctx.fillStyle = "rgb(120,200,50)";
      ctx.fillRect(snake[1][0]*size, snake[1][1]*size, size, size);
    }
    if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h) && snake.length > 2){
      ctx.fillStyle = "rgb(120,200,50)";
      ctx.fillRect(snake[2][0]*size, snake[2][1]*size, size, size);
    }
    ctx.fillStyle = "rgb(60,150,90)";
    ctx.fillRect(snake[0][0]*size, snake[0][1]*size, size, size);
    ctx.fillStyle = "rgba(50, 50, 50, 80%)";
    ctx.fillRect(0,0,w*size,h*size);
    ctx.fillStyle = "darkred";
    ctx.fillText("Game Over",w*10-((w*h)/(w+h)*9)-(w+h)/20,h*10-(w*h)/(w+h)*2);
    ctx.font = ((w*h)/(w+h)*3)+"px 'Patrick Hand SC'";
    ctx.fillText("Press [R] to restart",w*10-((w*h)/(w+h)*11)-(w+h)/20,h*10+(w*h)/(w+h)*2);
    state=0;
    return;
  }
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
  if(snake.length>1){
    if(DirMem[0][0]==1){
        ctx.clearRect((tail[0]+(DirMem[0][0]*(frameSkip-1)/6))*size, tail[1]*size, size/6, size);
      } else if(DirMem[0][0]==-1){
        ctx.clearRect((tail[0]+(DirMem[0][0]*(frameSkip-6)/6))*size, tail[1]*size, size/6, size);
      } else if(DirMem[0][1]==1){
        ctx.clearRect(tail[0]*size, (tail[1]+(DirMem[0][1]*(frameSkip-1)/6))*size, size, size/6);
      } else if(DirMem[0][1]==-1){
        ctx.clearRect(tail[0]*size, (tail[1]+(DirMem[0][1]*(frameSkip-6)/6))*size, size, size/6);
      }
  } else {
    if(Dir[0][0]==1){
      ctx.clearRect((tail[0]+(Dir[0][0]*(frameSkip-1)/6))*size, tail[1]*size, size/6, size);
    } else if(Dir[0][0]==-1){
      ctx.clearRect((tail[0]+(Dir[0][0]*(frameSkip-6)/6))*size, tail[1]*size, size/6, size);
    } else if(Dir[0][1]==1){
      ctx.clearRect(tail[0]*size, (tail[1]+(Dir[0][1]*(frameSkip-1)/6))*size, size, size/6);
    } else if(Dir[0][1]==-1){
      ctx.clearRect(tail[0]*size, (tail[1]+(Dir[0][1]*(frameSkip-6)/6))*size, size, size/6);
    }
  }
}

function Apple(){
  do {
    var xRand = Math.floor(Math.random() * w);
    var yRand = Math.floor(Math.random() * h);
  } while(snake.find(part => part[0] == xRand && part[1] == yRand) != undefined || (xRand == tail[0] && yRand == tail[1]))
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
    if(Math.abs(Dir[0][1])!=1){
      Dir.push([0,1]);
    }
    break;
  case "ArrowUp":
    if(Math.abs(Dir[0][1])!=1){
      Dir.push([0,-1]);
    }
    break;
  case "ArrowLeft":
    if(Math.abs(Dir[0][0])!=1){
      Dir.push([-1,0]);
    }
    break;
  case "ArrowRight":
    if(Math.abs(Dir[0][0])!=1){
      Dir.push([1,0]);
    }
    break;
  case "r":
    if(state==0){
      preGame()
    }
    break;
  default:
    return; // Quit when this doesn't handle the key event.
}
// Cancel the default action to avoid it being handled twice
event.preventDefault();
}, true);
// the last option dispatches the event to the listener first, then dispatches event to window
