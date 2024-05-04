var bgm = document.getElementById("bgm");
bgm.volume = 0.2;
bgm.play();
var soundVol = 0.5;

var sOff = document.getElementById("sfxOn");
var sOn = document.getElementById("sfxOff");
var mOff = document.getElementById("musicOn");
var mOn = document.getElementById("musicOff");

function turnOffSounds() {
  soundVol = 0;
  sOff.hidden=true;
  sOn.hidden=false;
}
function turnOnSounds() {
  soundVol = 0.5;
  sOff.hidden=false;
  sOn.hidden=true;
}
function turnOffMusic() {
  bgm.volume = 0;
  mOff.hidden=true;
  mOn.hidden=false;
}

function turnOnMusic() {
  bgm.volume = 0.2;
  mOff.hidden=false;
  mOn.hidden=true;
}