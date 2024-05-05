var fps = document.getElementById("fps");
var currentFrame = 0;
var lastFrame = 0;
var last30fps = [];
var avgfps = 0;
var state = 1;

function globalClock(){
  frameRate()
  soundVol = (soundBar.value/100);
  bgm.volume = (musicBar.value/100);
  Render();
  if((skipFrame) >= subframes && state==1) {
    Logic(); 
    skipFrame = 0;
  }
  skipFrame++;
  Clock();
  setTimeout(globalClock, 1000/64)
}

function frameRate(){
  const time = new Date();
  currentFrame = time[Symbol.toPrimitive]('number');
  last30fps.push(1000/(currentFrame-lastFrame));
  last30fps.forEach(n => avgfps += n)
  avgfps/= last30fps.length;
  fps.innerText = (1000/(currentFrame-lastFrame)).toFixed(2)+" fps avg: "+avgfps.toFixed(2);
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
    default:
      return; // Quit when this doesn't handle the key event.
  }
  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true); // the last option dispatches the event to the listener first, then dispatches event to window