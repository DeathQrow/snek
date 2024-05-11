//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var b = document.getElementById("bgCanvas")
var bctx = b.getContext("2d")
var w = 10;
var h = 10;
var subframes = 8;
var size;
CanvasResizer();
var sheetSnek = document.getElementById("snek_sheet");
var xSheet = 0;
var ySheet = 0;
var Hturn = 1;
var Tturn = 1;

//innitial game set usp
function preGame(){
  ctx.clearRect(0,0,w*size,h*size);
  bctx.clearRect(0,0,w*size,h*size);
  Dir = [[1,0]];
  Dir[1]=Dir[0];
  DirMem = [];
  DirMem[0]=Dir[1];
  DirMem[1]=Dir[1];
  Score = 0;
  state = 1;
  skipFrame = 0;
  canGrace = 1;
  graceRequest=0;
  document.getElementById("points").innerText = "Score: " + Score;
  snake = [[Math.floor((w-1)/2),Math.floor((h-1)/2)],[Math.floor((w-1)/2)-1,Math.floor((h-1)/2)]];
  tail = Array.from(snake[snake.length - 1]);
  Apples = [];
  for(var i = 0; i < 3; i++){
    Apple();
  }
}

function Render(){
  if(state==1) {
    ctx.clearRect(0,0,w*size,h*size)
    bctx.clearRect(0,0,w*size,h*size)
    for(i=1; i<snake.length-1; i++){
      if(i>0){
        if(DirMem[i][0]==1) xSheet=0;
        else if(DirMem[i][1]==1) xSheet=170;
        else if(DirMem[i][0]==-1) xSheet=340;
        else if(DirMem[i][1]==-1) xSheet=510;
        ctx.drawImage(sheetSnek,xSheet,170,160,160,(snake[i][0]+(DirMem[i][0]*skipFrame/subframes))*size, (snake[i][1]+(DirMem[i][1]*skipFrame/subframes))*size, size, size);
      }
    }
    for(i=0; i<snake.length; i++){
      if(DirMem[i]!=DirMem[i+1]&&i<DirMem.length-1&&snake.length>1&&Dir[1]!=DirMem[i+1]){
        if(i>0){
          if(DirMem[i][0]==1) {
            if(DirMem[i+1][1]==1) xSheet=340, Tturn=0;
            else xSheet=510, Tturn=1;
          }
          else if(DirMem[i][1]==1) {
            if(DirMem[i+1][0]==1) xSheet=0, Tturn=1;
            else xSheet=510, Tturn=0;
          }
          else if(DirMem[i][0]==-1) {
            if(DirMem[i+1][1]==1) xSheet=170, Tturn=1;
            else xSheet=0, Tturn=0;
          }
          else if(DirMem[i][1]==-1) {
            if(DirMem[i+1][0]==1) xSheet=170, Tturn=0;
            else xSheet=340, Tturn=1;
          }
        } else {
          if(Dir[1][0]==1) {
            if(DirMem[1][1]==1) xSheet=340, Hturn=0, Tturn=0;
            else xSheet=510, Hturn=1, Tturn=1;
          }
          else if(Dir[1][1]==1) {
            if(DirMem[1][0]==1) xSheet=0, Hturn=1, Tturn=1;
            else xSheet=510, Hturn=0, Tturn=0;
          }
          else if(Dir[1][0]==-1) {
            if(DirMem[1][1]==1) xSheet=170, Hturn=1, Tturn=1;
            else xSheet=0, Hturn=0, Tturn=0;
          }
          else if(Dir[1][1]==-1) {
            if(DirMem[1][0]==1) xSheet=170, Hturn=0, Tturn=0;
            else xSheet=340, Hturn=1, Tturn=1;
          }
        }
        ctx.clearRect(snake[i][0]*size, snake[i][1]*size, size, size);
        ctx.drawImage(sheetSnek,xSheet,340,160,160,snake[i][0]*size, snake[i][1]*size, size, size);
      } 
    }
    if(DirMem[snake.length-1][0]==1) xSheet=0;
    else if(DirMem[snake.length-1][1]==1) xSheet=170;
    else if(DirMem[snake.length-1][0]==-1) xSheet=340;
    else if(DirMem[snake.length-1][1]==-1) xSheet=510;
    if(DirMem[snake.length-1]!=DirMem[snake.length-2]){
      if(Tturn==1){
        ctx.save();
        ctx.translate((snake[snake.length-1][0]+((1+DirMem[snake.length-1][0]-DirMem[snake.length-1][1])/2))*size,(snake[snake.length-1][1]+((1+DirMem[snake.length-1][0]+DirMem[snake.length-1][1])/2))*size)
        ctx.rotate(Math.PI*skipFrame/(2*subframes))
        ctx.clearRect(0,0,(DirMem[snake.length-1][1]-DirMem[snake.length-1][0])*size,(-DirMem[snake.length-1][0]-DirMem[snake.length-1][1])*size);
        ctx.drawImage(sheetSnek,xSheet,510,160,160,(DirMem[snake.length-1][0]-DirMem[snake.length-1][1]),-(DirMem[snake.length-1][0]-DirMem[snake.length-1][1]), (DirMem[snake.length-1][1]-DirMem[snake.length-1][0])*size, (-DirMem[snake.length-1][0]-DirMem[snake.length-1][1])*size);
      } else {
        ctx.save();

        ctx.translate((snake[snake.length-1][0]+((1+DirMem[snake.length-1][0]+DirMem[snake.length-1][1])/2))*size,(snake[snake.length-1][1]+((1-DirMem[snake.length-1][0]+DirMem[snake.length-1][1])/2))*size)
        ctx.rotate(-Math.PI*skipFrame/(2*subframes))
        ctx.clearRect(0,0,(-DirMem[snake.length-1][1]-DirMem[snake.length-1][0])*size,(DirMem[snake.length-1][0]-DirMem[snake.length-1][1])*size);
        ctx.drawImage(sheetSnek,xSheet,510,160,160,(DirMem[snake.length-1][0]-DirMem[snake.length-1][1]),-(DirMem[snake.length-1][0]-DirMem[snake.length-1][1]), (-DirMem[snake.length-1][1]-DirMem[snake.length-1][0])*size, (DirMem[snake.length-1][0]-DirMem[snake.length-1][1])*size);
      }
      ctx.restore();
    }else{
      ctx.drawImage(sheetSnek,xSheet,510,160,160,(snake[snake.length-1][0]+(DirMem[snake.length-1][0]*skipFrame/subframes))*size, (snake[snake.length-1][1]+(DirMem[snake.length-1][1]*skipFrame/subframes))*size, size, size);
    }
    if(Dir[1][0]==1) xSheet=0;
    else if(Dir[1][1]==1) xSheet=170;
    else if(Dir[1][0]==-1) xSheet=340;
    else if(Dir[1][1]==-1) xSheet=510;
    if(Dir[1]!=DirMem[1]){
      if(Hturn==1){
        xSheet-=170;
        if(xSheet<0) xSheet=510;
        ctx.save();
        ctx.translate((snake[0][0]+((1+Dir[1][0]-Dir[1][1])/2))*size,(snake[0][1]+((1+Dir[1][0]+Dir[1][1])/2))*size)
        ctx.rotate(Math.PI*skipFrame/(2*subframes))
        if(skipFrame<2) ctx.clearRect((Dir[1][1]-Dir[1][0]),(Dir[1][1]-Dir[1][0]),(Dir[1][1]-Dir[1][0])*size,(-Dir[1][0]-Dir[1][1])*size);
        ctx.drawImage(sheetSnek,xSheet,0,160,160,0, 0, (Dir[1][1]-Dir[1][0])*size, (-Dir[1][0]-Dir[1][1])*size);
      } else {
        xSheet+=170;
        if(xSheet>510) xSheet=0;
        ctx.save();

        ctx.translate((snake[0][0]+((1+Dir[1][0]+Dir[1][1])/2))*size,(snake[0][1]+((1-Dir[1][0]+Dir[1][1])/2))*size)
        ctx.rotate(-Math.PI*skipFrame/(2*subframes))
        if(skipFrame<2) ctx.clearRect((Dir[1][0]-Dir[1][1]),(Dir[1][0]-Dir[1][1]),(-Dir[1][1]-Dir[1][0])*size,(Dir[1][0]-Dir[1][1])*size);
        ctx.drawImage(sheetSnek,xSheet,0,160,160,0, 0, (-Dir[1][1]-Dir[1][0])*size, (Dir[1][0]-Dir[1][1])*size);
      }
      ctx.restore();
    }else{
      ctx.drawImage(sheetSnek,xSheet,0,160,160,(snake[0][0]+(Dir[1][0]*skipFrame/subframes))*size, (snake[0][1]+(Dir[1][1]*skipFrame/subframes))*size, size, size);
    }
    bctx.fillStyle = "red";
    for(i=0; i<Apples.length; i++) bctx.fillRect(Apples[i][0]*size,Apples[i][1]*size,size,size);
  } else {
    
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
    if(Score < (w*h-Apples.length-1)) Apple();
  } 
  if(DirMem.length>=snake.length) {
    DirMem.pop();
  }
  tail = Array.from(snake[snake.length - 1]);
  if(Dir.length>2) Dir.shift()
  if(Dir.length>4) Dir.splice(4,Infinity)
  Dir[0]=Dir[1];
  DirMem.unshift(Dir[1]);
  //game over condition
  if((snake[0][0]<0||snake[0][0]>=w||snake[0][1]<0||snake[0][1]>=h||snake.slice(1).find(part => part[0] == snake[0][0] && part[1] == snake[0][1]) != undefined) && state == 1){
    const gradient = bctx.createRadialGradient((snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size, 0.15*size, (snake[0][0]+0.5)*size, (snake[0][1]+0.5)*size,1.5*size);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "transparent");
    bctx.fillStyle = gradient;
    bctx.fillRect((snake[0][0]-2)*size, (snake[0][1]-2)*size, 5*size, 5*size);
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
  if(Dir.length>2&&Dir[0][0]!=Dir[2][0]*-1&&Dir[0][1]!=Dir[2][1]*-1) {
    Dir.shift();
    DirMem[0]=Dir[1];
  }
}

function Apple(){
  do {
    var xRand = Math.floor(Math.random() * w);
    var yRand = Math.floor(Math.random() * h);
  } while(snake.find(part => part[0] == xRand && part[1] == yRand) != undefined || (Apples.find(ap => ap[0] == xRand && ap[1] == yRand) != undefined))
  Apples.push([xRand, yRand]);
  bctx.fillStyle = "red";
  bctx.fillRect(xRand*size,yRand*size,size,size);
}