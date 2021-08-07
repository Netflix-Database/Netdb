var video = document.querySelector('video');
var videocontainer = document.getElementById('video-container');
var progressbar = document.getElementById('progressbar');
var progress = document.getElementById('progress');
var buffer = document.getElementById('buffer');
var hover = document.getElementById('hover');
var progressthumb = document.getElementById('progressthumb');
var bar = document.getElementById('bar');
var playBtn = document.getElementById('play-pause');
var skipBack = document.getElementById('back');
var skipFor = document.getElementById('skip');
var overlay = document.getElementById('overlay');
var pausedoverlay = document.getElementById('pausedoverlay');
var controls = document.getElementById('controls');
var fullscreen = document.getElementById('fullscreen');
var volume = document.getElementById('volume');
var timetillend = document.getElementById('timetillend');
var thumbTime = document.getElementById('thumbtime');

var playIcon = document.getElementById('playicon');
var pauseIcon = document.getElementById('pauseicon');
var skipforIcon = document.getElementById('skipforicon');
var skipbackIcon = document.getElementById('skipbackicon');
var muteIcon = document.getElementById('muteicon');
var loadingAnimation = document.getElementById('loadinganimation');

const timeToWait = 3000;

var time = false;
var isvisible = false;
var thumbInUse = false;
var selectedLanguage;
var selectedQuality = 0;
var player = dashjs.MediaPlayer().create();
var currentRequest = null;

function Setup() {

  video.poster = poster;
  document.getElementById('title').innerHTML = title;
  document.getElementById('episode').innerHTML = episode;
  document.getElementById('overlaytitle').innerHTML = title;
  document.getElementById('description').innerHTML = description;

  var url = manifestLink ;

  /*player.extend("RequestModifier", function () {
    return {
      modifyRequestHeader: xhr => {

        if(currentRequest == null) {
          return xhr;
        }

        xhr = new XMLHttpRequest();
        xhr.open('GET', currentRequest.url + '?range=' + currentRequest.range, true);

        return xhr;
    }
    };
});*/

  player.initialize(video, url, false);
  player.updateSettings({ 'streaming': { 'trackSwitchMode': { 'video': 'alwaysReplace' } } });
  player.updateSettings({ 'streaming': { 'buffer': { 'flushBufferAtTrackSwitch': true } } });
  player.on(dashjs.MediaPlayer.events['STREAM_INITIALIZED'], initPlayer);    
  player.on(dashjs.MediaPlayer.events['PLAYBACK_SEEKING'], displayLoadingAnimation);
  player.on(dashjs.MediaPlayer.events['BUFFER_EMPTY'], displayLoadingAnimation);
  player.on(dashjs.MediaPlayer.events['PLAYBACK_SEEKED'], hideLoadingAnimation);
  player.on(dashjs.MediaPlayer.events['BUFFER_LOADED'], hideLoadingAnimation);
  player.on(dashjs.MediaPlayer.events['ERROR'], error); 
  player.on(dashjs.MediaPlayer.events['PLAYBACK_ERROR'], error);

  player.on('fragmentLoadingStarted', function (data) {
    currentRequest = data.request;
});
};

function displayLoadingAnimation() {
  loadingAnimation.style.display = 'block';
}

function hideLoadingAnimation() {
  loadingAnimation.style.display = 'none';
}

function error() {
  location.replace("https://hub.netdb.ga/error")
}

function initPlayer() {
  setTime();
  video.volume = volume.value / 100;

  var options = document.getElementById("qualityOptions");
  options.innerHTML = "";

  var bitrates = player.getBitrateInfoListFor("video");

  var child = document.createElement("li");
  child.classList.add("selected");
  child.setAttribute("onClick", "changeQuality(-1);");
  child.append((document.createElement("h1").innerHTML = "Auto"));
  options.append(child);

  for (let i = 0; i < bitrates.length; i++) {
    var child = document.createElement("li");
    child.setAttribute("onClick", "changeQuality(" + i + ");");
    child.append(
      (document.createElement("h1").innerHTML = bitrates[i].width + "p")
    );
    options.append(child);
  }

  options = document.getElementById("languageOptions");
  options.innerHTML = "";

  var audioTracks = player.getTracksFor("audio");

  for (let i = 0; i < audioTracks.length; i++) {
    var child = document.createElement("li");
    child.setAttribute("onClick", "javascript: changeLanguage(" + i + ");");
    child.append(
      (document.createElement("h1").innerHTML = audioTracks[i].lang)
    );
    options.append(child);
  }

  var list = document.getElementById("languageOptions").getElementsByTagName("li");
  var currentTrack = player.getCurrentTrackFor("audio").lang;

  for (let i = 0; i < list.length; i++) {
    if (currentTrack == list[i].innerHTML) {
      selectedLanguage = i;
      list[i].classList.add("selected");
    }
  }
}

progressthumb.onmouseover = function () {
  setThumbTime();
};

function setThumbTime() {
  var time = video.duration * (progress.style.width.replace("%", "") / 100);

  var hour = parseInt(time / 3600);
  if (hour < 10) {
    hour = "0" + hour;
  }
  var minute = parseInt((time % 3600) / 60);
  if (minute < 10) {
    minute = "0" + minute;
  }
  var second = Math.ceil(time % 60);
  if (second < 10) {
    second = "0" + second;
  }

  var filetime;

  if (hour == 0) {
    filetime = minute + ":" + second;
  } else {
    filetime = hour + ":" + minute + ":" + second;
  }

  thumbTime.innerHTML = filetime;
}

function changeQuality(quality) {
  if(quality < 0)
  {
    player.updateSettings({ 'streaming': { 'abr': { 'autoSwitchBitrate': { 'video': true } } } });
  }
  else
  {
    player.updateSettings({ 'streaming': { 'abr': { 'autoSwitchBitrate': { 'video': false } } } });
    player.setQualityFor("video", quality, true);
  }

  var list = document.getElementById("qualityOptions").getElementsByTagName("li");
  list[selectedQuality].classList.remove('selected');
  list[quality + 1].classList.add('selected');
  selectedQuality = quality;
}

function changeLanguage(lang) {
  player.setCurrentTrack(player.getTracksFor('audio')[lang]);

  var list = document.getElementById("languageOptions").getElementsByTagName("li");
  list[selectedLanguage].classList.remove('selected');
  list[lang].classList.add('selected');
  selectedLanguage = lang;
}

function setTime() {
  var time = video.duration - video.currentTime;

  var hour = parseInt(time / 3600);
  if (hour < 10) {
    hour = "0" + hour;
  }
  var minute = parseInt((time % 3600) / 60);
  if (minute < 10) {
    minute = "0" + minute;
  }
  var second = Math.ceil(time % 60);
  if (second < 10) {
    second = "0" + second;
  }

  var filetime;

  if (hour == 0) {
    filetime = minute + ":" + second;
  } else {
    filetime = hour + ":" + minute + ":" + second;
  }

  timetillend.innerHTML = filetime;
}

function hidePausedOverlay() {
  pausedoverlay.style.opacity = 0;
  setTimeout(function(){
    pausedoverlay.style.display = 'none';
  }, 300);
}

function displayPausedOverlay() {
  pausedoverlay.style.display = 'block';
  video.style.cursor = 'default';
  setTimeout(function(){pausedoverlay.style.opacity = 1;}, 100);
}

document.addEventListener('contextmenu', event => event.preventDefault());

function displayHover() {
  var cursorX = window.event.clientX - 32;

  var maxlength = bar.clientWidth;
  hover.style.width = (cursorX / maxlength) * 100 + '%';
}

bar.onclick = function(event) {
  var cursorX = event.clientX - 32;
  
  var maxlength = bar.clientWidth;

  progressthumb.style.marginLeft = 'calc(' + ((cursorX / maxlength) * 100) + '% - 0.5em)';
  progress.style.width = (cursorX / maxlength) * 100 + '%';
  skipToTime();
}

dragElement(progressthumb);

function dragElement(elmnt) {
  var pos3 = 0;

  progressthumb.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    document.onmouseup = closeDragElement;

    thumbInUse = true;
    progressthumb.classList.add('thumbhover');
    bar.classList.add('barhover');
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX - 32; 
    var maxlength = bar.clientWidth;

    if(pos3 < 0) {
       pos3 = -1;
    }
    else if(pos3 > maxlength) 
    {
      pos3 = maxlength;
    }

    elmnt.style.marginLeft = 'calc(' + ((pos3 / maxlength) * 100) + '% - 0.5em)';

    progress.style.width = (pos3 / maxlength) * 100 + '%';

    setThumbTime();
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    thumbInUse = false;
    progressthumb.classList.remove('thumbhover');
    bar.classList.remove('barhover');
    skipToTime();
  }
}

video.addEventListener('mousemove', e=> {
  controlcontrols();
})

function controlcontrols() {
  if (isvisible) {
    time = true;
    return;
  }

 isvisible = true;
 opencontrols();

 setTimeout(timeminusminus, timeToWait);
}

function timeminusminus() {
  if (time) {
    time = false;
    setTimeout(timeminusminus, timeToWait);
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

  if (event.key == ' ') {
      playpause();
      return;
  }

  if (event.key == 'ArrowRight') {
      skip(video.currentTime + 5);
      return;
  }

  if (event.key == 'ArrowLeft') {
      skip(video.currentTime - 5);
      return;
  }

  if (event.key == 'ArrowUp') {

    if(video.volume == 1) {
      return;
    }

    if(video.volume + 0.1 > 1) {
      video.volume = 1;
      volume.value = 100;
      return;
    }

      video.volume += 0.1;
      volume.value -= -10;
      return;
  }

  if (event.key == 'ArrowDown') {

    if(video.volume == 0) {
      return;
    }

    if(video.volume - 0.1 < 0) {
      video.volume = 0;
      volume.value = 0;
      return;
    }

    video.volume -= 0.1;
    volume.value -= 10;
    return;
  }

  if (event.key == 'm') {
    showIcon(muteIcon);
    video.volume = 0;
    volume.value = 0;
    return;
  }

  if (event.key == 'f') {
    toggleFullscreen();
    return;
  }
});

function opencontrols() {

if(pausedoverlay.style.display = 'block') {
  hidePausedOverlay();
}

    overlay.style.display = 'flex';
    video.style.cursor = 'default';
    setTimeout(function(){overlay.style.opacity = 1;}, 100);
}

function closecontrols() {
  video.style.cursor = 'none';
  overlay.style.opacity = 0;
  setTimeout(function(){
    overlay.style.display = 'none';
  }, 300);

  if(video.paused)
{
  displayPausedOverlay();
}
}

function skip(time) {

  if(time < 0) {
    showIcon(skipbackIcon);
  }
  else
  {
    showIcon(skipforIcon);
  }

  video.currentTime = time;
}

function skipToTime() {
 video.currentTime = video.duration * progress.style.width.replace('%', '') * 0.01;
}

video.addEventListener('mousedown', e => {
  if(e.button === 0) {
    playpause();
  }
})

playBtn.onclick = function() {
  playpause();
}

skipFor.onclick = function() {
  skip(video.currentTime + 5);
}

skipBack.onclick = function() {
  skip(video.currentTime - 5);
}

fullscreen.onclick = function() {
  toggleFullscreen();
}

video.addEventListener('timeupdate', function() {

  buffer.style.width = ((video.currentTime + player.getBufferLength()) / video.duration) * 100 + '%';
  
  setTime();

if(!thumbInUse) {
  var position = video.currentTime / video.duration;

  progress.style.width = position * 100 + '%';
  progressthumb.style.marginLeft = 'calc(' + (position * 100) + '% - 0.5em)';
}

  if (video.ended) {
    playBtn.src = 'playwhitethick.png';
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
  if(isvisible == false) {
    controlcontrols();
  }

  if (video.paused) {
    playBtn.src = 'pause.png';
    showIcon(pauseIcon);
    video.play();
  }
  else {
    playBtn.src = 'playwhitethick.png';
    showIcon(playicon);
    video.pause();
  }
}

function showIcon(icon) {
  icon.style.display = 'block';

  setTimeout(
    function() {
      icon.style.display = 'none';
  }, 490);
}

function displayProgress() {
 progressbar.style.opacity = 1;
}

function hideProgress() {
  progressbar.style.opacity = 0;
}

function changeVolume() {
  video.volume = volume.value / 100;
}
