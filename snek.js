//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var w = 10;
var h = 10;
var subframes = 10;
if(window.innerHeight*w>(window.innerWidth+130)*h) {
  var size = Math.ceil((window.innerWidth-20)/w);
} else {
  var size = Math.ceil((window.innerHeight-130)/h);
}
c.style.background = "repeating-conic-gradient(#3d285d 0% 25%, #432c68 0% 50%) 0% 0% /"+200/w+"% "+200/h+"%";

//innitial game set up
function preGame(){
  c.width = w*size;
  c.height = h*size;
  ctx.fillStyle = "rgb(50,50,60)";
  ctx.clearRect(0,0,w*size,h*size);
  Dir = [[1,0],[1,0]];
  DirMem = [[1,0]];
  Score = 0;
  state = 1;
  skipFrame = 0;
  canGrace = 1;
  graceRequest=0;
  document.getElementById("points").innerText = "Score: " + Score;
  snake = [[Math.floor((w-1)/2),Math.floor((h-1)/2)]];
  tail = Array.from(snake[snake.length - 1]);
  Apples = [];
  for(var i = 0; i < 3; i++){
    Apple();
  }
}

function Render(){
  if(state==1) {
    ctx.clearRect(0,0,w*size,h*size)
    ctx.fillStyle = "red";
    for(i=0; i<Apples.length; i++) ctx.fillRect(Apples[i][0]*size,Apples[i][1]*size,size,size);
    
    for(i=0; i<snake.length; i++){
      if(DirMem[i-1]!=DirMem[i]&&i<DirMem.length-1&&snake.length>1){
        ctx.fillStyle = "rgb(120,200,50)";
        ctx.fillRect((snake[i][0])*size, snake[i][1]*size, size, size);
      }
      if(i>0){
        ctx.fillStyle = "rgb(120,200,50)";
        if(Math.abs(DirMem[i-1][1])!=1){
          ctx.fillRect((snake[i][0]+(DirMem[i-1][0]*skipFrame/subframes))*size, snake[i][1]*size, size, size);
        } else if(Math.abs(DirMem[i-1][0])!=1){
          ctx.fillRect(snake[i][0]*size, (snake[i][1]+(DirMem[i-1][1]*skipFrame/subframes))*size, size, size);
        }
      }
    }
    ctx.fillStyle = "rgb(60,150,90)";
    if(Math.abs(Dir[1][1])!=1){
      ctx.fillRect((snake[0][0]+(Dir[1][0]*skipFrame/subframes))*size, snake[0][1]*size, size, size);
    } else if(Math.abs(Dir[1][0])!=1){
      ctx.fillRect(snake[0][0]*size, (snake[0][1]+(Dir[1][1]*skipFrame/subframes))*size, size, size);
    }
  }
}

//the game loop
function Logic() {
  for(var i=snake.length-1; i>0; i--){
    snake[i][0] = snake[i-1][0];
    snake[i][1] = snake[i-1][1];
  }
  snake[0][0]+=Dir[1][0];
  snake[0][1]+=Dir[1][1];
  
  if (Apples.find(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]) != undefined){
    Apples.splice(Apples.findIndex(ap => ap[0] == snake[0][0] && ap[1] == snake[0][1]),1);
    Score++;
    var appleSFX = new Audio("Sounds/apple_collect.mp3");
    appleSFX.volume = soundVol;
    appleSFX.play();
    document.getElementById("points").innerText = "Score: " + Score;
    snake.push(tail);
    DirMem.push(DirMem[DirMem.length-1])
    ctx.fillStyle = "rgb(120,200,50)";
    ctx.fillRect(snake[snake.length-1][0]*size, snake[snake.length-1][1]*size, size, size);
    if(Score < (w*h-Apples.length-1)) Apple();
  } 
  if(DirMem.length>=snake.length) {
    DirMem.pop();
  }
  DirMem.unshift(Dir[1]);
  tail = Array.from(snake[snake.length - 1]);
  if(Dir.length>2) Dir.shift()
  if(Dir.length>4) Dir.splice(4,Infinity)
  Dir[0]=Dir[1];
  //game over condition
  if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h||snake.slice(1).find(part => part[0] == snake[0][0] && part[1] == snake[0][1]) != undefined) && state == 1){
    const gradient = ctx.createRadialGradient((snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size, 0.75*size, (snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size,2*size);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect((snake[0][0]-2)*size, (snake[0][1]-2)*size, 5*size, 5*size);
    ctx.fillStyle = "rgb(60,150,90)";
    ctx.fillRect(snake[0][0]*size, snake[0][1]*size, size, size);
    ctx.fillStyle = "rgba(50, 50, 50, 80%)";
    ctx.fillRect(0,0,w*size,h*size);
    ctx.textAlign = "center";
    ctx.fillStyle = "darkred";
    ctx.font = ((w*h)/(w+h)*size/3)+"px 'Patrick Hand'";
    ctx.fillText("Game Over",(w*size/2),h*size/2.5);
    ctx.font = ((w*h)/(w+h)*size/6)+"px 'Patrick Hand'";
    ctx.fillText("Press [R] to restart",w*size/2,h*size/1.8);
    var deathSFX = new Audio("Sounds/bonk.mp3");
    deathSFX.volume = soundVol;
    deathSFX.play();
    state=0;
    return;
  }
  if(Score==(w*h-1)){
    ctx.fillStyle = "rgba(150, 150, 30, 80%)";
    ctx.fillRect(0,0,w*size,h*size);
    ctx.fillStyle = "orange";
    ctx.textAlign = "center";
    ctx.fillText("You Win!",(w*size/2),h*size/2.5);
    ctx.font = ((w*h)/(w+h)*size/6)+"px 'Patrick Hand'";
    ctx.fillText("Press [R] to restart",w*size/2,h*size/1.8);
    state=0;
    return;
  }
}

function Grace(){
  if(Dir.length>2&&Dir[0][0]!=Dir[2][0]*-1&&Dir[0][1]!=Dir[2][1]*-1) Dir.shift()
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