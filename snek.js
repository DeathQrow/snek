//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var w = 20;
var h = 20;
if(window.innerHeight*w>(window.innerWidth*h+50)) {
  var size = Math.ceil((window.innerWidth*0.9)/w);
} else {
  var size = Math.ceil((window.innerHeight*0.85)/h);
}
console.log(size)
var subframes = 5;
if(size%subframes!=0){
  size -= size%subframes;
}

console.log(size)
c.width = w*size;
c.height = h*size;
c.style.background = "repeating-conic-gradient(#3d285d 0% 25%, #432c68 0% 50%) 0% 0% /"+200/w+"% "+200/h+"%";
var fps = document.getElementById("fps");
var currentFrame = 0;
var lastFrame = 0;
var last30fps = [];
var avgfps = 0;
var skipFrame = 0;
var state = 1;

//innitial game set up
function preGame(){
  
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.font = ((w*h)/(w+h)*size/3)+"px 'Patrick Hand SC'";
  ctx.clearRect(0,0,w*size,h*size);
  Dir = [[1,0]];
  DirMem = [[1,0]];
  Score = 0;
  state = 1;
  skipFrame = 0;
  document.getElementById("points").innerText = "Score: " + Score;
  snake = [[1,3]];
  tail = Array.from(snake[snake.length - 1]);
  Apples = [];
  for(var i = 0; i < 3; i++){
    Apple();
  }
}

function Render(){
  
  const time = new Date();
  currentFrame = time[Symbol.toPrimitive]('number');
  last30fps.push(1000/(currentFrame-lastFrame));
  avgfps = 0;
  last30fps.forEach(n => avgfps += n)
  avgfps/= last30fps.length;
  fps.innerText = (1000/(currentFrame-lastFrame)).toFixed(2)+" fps avg: "+avgfps.toFixed(2);

  lastFrame = time[Symbol.toPrimitive]('number');
  if(state==1) {
    if(snake.length>1){
      ctx.fillStyle = "rgb(120,200,50)";
      ctx.fillRect(snake[0][0]*size, snake[0][1]*size, size, size);
    }
    ctx.fillStyle = "rgb(60,150,90)";
    if(Math.abs(Dir[0][1])!=1){
      ctx.fillRect((snake[0][0]+(Dir[0][0]*skipFrame/subframes))*size, snake[0][1]*size, size, size);
    } else if(Math.abs(Dir[0][0])!=1){
      ctx.fillRect(snake[0][0]*size, (snake[0][1]+(Dir[0][1]*skipFrame/subframes))*size, size, size);
    }
    cleanUp();
  }
  
  if(skipFrame >= subframes && state == 1) {
    gameLoop(); 
    
    skipFrame = 0;
  }
  skipFrame++;
  setTimeout(Render, 1000/64)
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
    if(Score < (w*h-Apples.length-1)) Apple();
  }
  
  tail = Array.from(snake[snake.length - 1]);
  if(Dir.length>1) Dir.shift()

  //game over condition
  if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h||snake.slice(1).find(part => part[0] == snake[0][0] && part[1] == snake[0][1]) != undefined) && state == 1){
    const gradient = ctx.createRadialGradient((snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size, 0.75*size, (snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size,2*size);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect((snake[0][0]-2)*size, (snake[0][1]-2)*size, 5*size, 5*size);
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
    ctx.textAlign = "center";
    ctx.fillText("Game Over",(w*size/2),h*size/2.5);
    ctx.font = ((w*h)/(w+h)*size/6)+"px 'Patrick Hand SC'";
    ctx.fillText("Press [R] to restart",w*size/2,h*size/1.8);
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
        ctx.clearRect((tail[0]+(DirMem[0][0]*(skipFrame-1)/subframes))*size, tail[1]*size, size/subframes, size);
      } else if(DirMem[0][0]==-1){
        ctx.clearRect((tail[0]+(DirMem[0][0]*(skipFrame-subframes)/subframes))*size, tail[1]*size, size/subframes, size);
      } else if(DirMem[0][1]==1){
        ctx.clearRect(tail[0]*size, (tail[1]+(DirMem[0][1]*(skipFrame-1)/subframes))*size, size, size/subframes);
      } else if(DirMem[0][1]==-1){
        ctx.clearRect(tail[0]*size, (tail[1]+(DirMem[0][1]*(skipFrame-subframes)/subframes))*size, size, size/subframes);
      }
  } else {
    if(Dir[0][0]==1){
      ctx.clearRect((tail[0]+(Dir[0][0]*(skipFrame-1)/subframes))*size, tail[1]*size, size/subframes, size);
    } else if(Dir[0][0]==-1){
      ctx.clearRect((tail[0]+(Dir[0][0]*(skipFrame-subframes)/subframes))*size, tail[1]*size, size/subframes, size);
    } else if(Dir[0][1]==1){
      ctx.clearRect(tail[0]*size, (tail[1]+(Dir[0][1]*(skipFrame-1)/subframes))*size, size, size/subframes);
    } else if(Dir[0][1]==-1){
      ctx.clearRect(tail[0]*size, (tail[1]+(Dir[0][1]*(skipFrame-subframes)/subframes))*size, size, size/subframes);
    }
  }
}

function Apple(){
  do {
    var xRand = Math.floor(Math.random() * w);
    var yRand = Math.floor(Math.random() * h);
  } while(snake.find(part => part[0] == xRand && part[1] == yRand) != undefined || (Apples.find(ap => ap[0] == xRand && ap[1] == yRand) != undefined))
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
    if(Math.abs(Dir[Dir.length-1][1])!=1){
      Dir.push([0,1]);
    }
    break;
  case "ArrowUp":
    if(Math.abs(Dir[Dir.length-1][1])!=1){
      Dir.push([0,-1]);
    }
    break;
  case "ArrowLeft":
    if(Math.abs(Dir[Dir.length-1][0])!=1){
      Dir.push([-1,0]);
    }
    break;
  case "ArrowRight":
    if(Math.abs(Dir[Dir.length-1][0])!=1){
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
