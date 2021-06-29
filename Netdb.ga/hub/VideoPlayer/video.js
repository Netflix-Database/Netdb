var video = document.querySelector('video');
var videocontainer = document.getElementById('video-container');
var progress = document.getElementById('progress');
var progressbar = document.getElementById('progressbar');
var playBtn = document.getElementById('play-pause');
var controls = document.getElementById('controls');
var fullscreen = document.getElementById('fullscreen');

var time = false;
var isvisible = false;

video.addEventListener('mousemove', e=> {
  time = 3;

  controlcontrols();
})

function controlcontrols() {
  if (isvisible) {
    time = true;
    return;
  }

 isvisible = true;
 opencontrols();

setTimeout(timeminusminus, 3000);
}

function timeminusminus() {
  if (time) {
    time = false;
    setTimeout(timeminusminus, 3000);
  }
  else {
    if (controls.matches(':hover')) {
      time = true;
    timeminusminus();
    return;
    }

      isvisible = false;
      closecontrols();
  }
}

document.querySelector('body').addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

console.log(event);

  if (event.key == ' ') {
      playpause();
      return;
  }

  if (event.key == 'ArrowRight') {
      skip(1000);
      return;
  }

  if (event.key == 'ArrowLeft') {
      skip(-1000);
      return;
  }

  if (event.key == 'ArrowUp') {

      return;
  }

  if (event.key == 'ArrowDown') {

      return;
  }

  if (event.key == 'f') {
    toggleFullscreen();
  }
});

function opencontrols() {
    controls.style.display = 'flex';
    video.style.cursor = 'default';
    setTimeout(function(){controls.style.opacity = 1;}, 100);
}

function closecontrols() {
      video.style.cursor = 'none';
    controls.style.opacity = 0;
    setTimeout(function(){
      controls.style.display = 'none';
    }, 300);
}

function skip(time) {
  video.currentTime += time;
}

function skipToTime() {
 video.currentTime = video.duration * (progressbar.value * 0.001);
}

video.addEventListener('mousedown', e => {
   playpause();
})

playBtn.onclick = function() {
  playpause();
}

fullscreen.onclick = function() {
  toggleFullscreen();
}


video.addEventListener('timeupdate', function() {
  var position = video.currentTime / video.duration;

  progressbar.value = position * 1000;

  var time = video.duration - video.currentTime;

  var hour = parseInt((time) / 3600);
  if (hour<10) {
      hour = "0" + hour;
  }
  var minute = parseInt((time % 3600) / 60);
  if (minute<10) {
      minute = "0" + minute;
  }
  var second = Math.ceil(time % 60);
  if (second<10) {
      second = "0" + second;
  }
  var filetime = hour + ":" + minute + ":" + second;

 document.getElementById('timetillend').innerHTML = filetime;

  if (video.ended) {
    playBtn.src = 'playblackthick.png';
  }
})

function toggleFullscreen() {
  if (!document.fullscreenElement) {
  videocontainer.requestFullscreen();
}
else {
  document.exitFullscreen();
}
}

function playpause() {
  if (video.paused) {
    playBtn.src = 'pause.png';
    video.play();
  }
  else {
    playBtn.src = 'playwhitethick.png';
    video.pause();
  }
}

function displayProgress() {
 progress.style.opacity = 1;
}

function hideProgress() {
  progress.style.opacity = 0;
}
