var fpscount = document.getElementById("fps");
var currentFrame = 0;
var lastFrame = 0;
var last30fps = [];
var avgfps = 0;
var state = 1;

var fps = 60;
var now;
var then = performance.now();
var interval = 1000/fps;
var delta;

function globalClock(){
  
  requestAnimationFrame(globalClock)
  now = performance.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
  frameRate()
  soundVol = (soundBar.value/100);
  bgm.volume = (musicBar.value/100);
  if(state==1){
  console.log(skipFrame, Dir[0], Dir[1], Dir[2], Dir[3])
  if(skipFrame > 0 && skipFrame <= (subframes/2) && canGrace >= 1 && graceRequest == 1){
    Grace();
    canGrace = 0;
    graceRequest=0;
  } 
  Render();
  if(skipFrame == subframes) {
    if(Dir.length>2) canGrace = 0;
    Logic(); 
    skipFrame = 0;
    canGrace += 0.5;
    graceRequest = 0;
  }
  if(Dir.length>2) canGrace = 0;
  skipFrame++;
  }
  Clock();
  }
}

window.onresize = CanvasResizer;

function CanvasResizer(){
  if(window.innerHeight*w>(window.innerWidth+130)*h) {
    size = Math.ceil((window.innerWidth-20)/w);
  } else {
    size = Math.ceil((window.innerHeight-130)/h);
  }
  if(size%subframes!=0) size-=size%subframes;
  b.style.background = "repeating-conic-gradient(#3d285d 0% 25%, #432c68 0% 50%) 0% 0% /"+200/w+"% "+200/h+"%";
  c.width = w*size;
  c.height = h*size;
  b.width = w*size;
  b.height = h*size;
  if(state==0){
    for(i=1; i<snake.length-1; i++){
      if(i>0){
        if(DirMem[i][0]==1) xSheet=0;
        else if(DirMem[i][1]==1) xSheet=170;
        else if(DirMem[i][0]==-1) xSheet=340;
        else if(DirMem[i][1]==-1) xSheet=510;
        ctx.drawImage(sheetSnek,xSheet,170,160,160,(snake[i][0])*size, (snake[i][1])*size, size, size);
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
    ctx.drawImage(sheetSnek,xSheet,510,160,160,(snake[snake.length-1][0])*size, (snake[snake.length-1][1])*size, size, size);
    if(Dir[1][0]==1) xSheet=0;
    else if(Dir[1][1]==1) xSheet=170;
    else if(Dir[1][0]==-1) xSheet=340;
    else if(Dir[1][1]==-1) xSheet=510;
    ctx.drawImage(sheetSnek,xSheet,0,160,160,(snake[0][0])*size, (snake[0][1])*size, size, size);
    bctx.fillStyle = "red";
    for(i=0; i<Apples.length; i++) bctx.fillRect(Apples[i][0]*size,Apples[i][1]*size,size,size);
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
  }
}

function frameRate(){
  const time = new Date();
  currentFrame = time[Symbol.toPrimitive]('number');
  last30fps.push(1000/(currentFrame-lastFrame));
  last30fps.forEach(n => avgfps += n)
  avgfps/= last30fps.length;
  fpscount.innerText = (1000/(currentFrame-lastFrame)).toFixed(2)+" fpscount avg: "+avgfps.toFixed(2);
  lastFrame = time[Symbol.toPrimitive]('number');
}

function Clock() {
  const today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;
  document.getElementById('clock').innerHTML =  h + ":" + m + ":" + s;
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
    case "s":
      if(Math.abs(Dir[Dir.length-1][1])!=1){
        Dir.push([0,1]);
      }
      break;
    case "w":
      if(Math.abs(Dir[Dir.length-1][1])!=1){
        Dir.push([0,-1]);
      }
      break;
    case "a":
      if(Math.abs(Dir[Dir.length-1][0])!=1){
        Dir.push([-1,0]);
      }
      break;
    case "d":
      if(Math.abs(Dir[Dir.length-1][0])!=1){
        Dir.push([1,0]);
      }
      break;
    case "r":
      if(state==0){
        preGame()
      }
      break;
    case "p":
      if(fpscount.hidden==1){
        fpscount.hidden=0;
      } else fpscount.hidden=1;
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
  graceRequest=1;
  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true); // the last option dispatches the event to the listener first, then dispatches event to window