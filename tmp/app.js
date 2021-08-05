var h1 = document.getElementById('time');

function showTime() { 
var today = new Date();

var time;

var hour = today.getHours()
if(hour < 10) {
  hour = '0' + hour;
}

var min = today.getMinutes()
if(min < 10) {
  min = '0' + min;
}

var sec = today.getSeconds()
if(sec < 10) {
  sec = '0' + sec;
}


time = hour + ':' + min + ':' + sec;

h1.innerHTML = time;

setTimeout(showTime, 1000);
}

showTime();