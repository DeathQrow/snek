var bgm = document.getElementById("bgm");
bgm.volume = 0.2;
bgm.play();
var soundVol = 0.5;
var lastSound, lastMusic;

var sOn = document.getElementById("sfxOn");
var sOff = document.getElementById("sfxOff");
var soundBar = document.getElementById("sfxVolBar");
var mOn = document.getElementById("musicOn");
var mOff = document.getElementById("musicOff");
var musicBar = document.getElementById("musicVolBar");

musicBar.addEventListener("input", setMusicVol)
soundBar.addEventListener("input", setSoundVol)

function turnOffSounds() {
  lastSound = soundBar.value;
  soundBar.value = 0;
  sOn.hidden=true;
  sOff.hidden=false;
}
function turnOnSounds() {
  soundBar.value = lastSound;
  sOn.hidden=false;
  sOff.hidden=true;
}
function turnOffMusic() {
  lastMusic = musicBar.value;
  musicBar.value = 0;
  mOn.hidden=true;
  mOff.hidden=false;
}

function turnOnMusic() {
  musicBar.value = lastMusic;
  mOn.hidden=false;
  mOff.hidden=true;
}

function setMusicVol(){
  bgm.volume = musicBar.value/100;
  if(musicBar.value>0){
    mOn.hidden=false;
    mOff.hidden=true;
  } else {
    mOn.hidden=true;
    mOff.hidden=false;
  }
  lastMusic = musicBar.value;
}

function setSoundVol(){
  soundVol = soundBar.value/100;
  if(soundBar.value>0){
    sOn.hidden=false;
    sOff.hidden=true;
  } else {
    sOn.hidden=true;
    sOff.hidden=false;
  }
  lastSound = soundBar.value
}