import anime from 'animejs';

LoginManager.isLoggedIn().then(async (e) => {
  if (e) {
    document.getElementById('loginLoading').style.display = 'none';
    document.getElementById('profile').classList.remove('d-none');

    document.getElementById('username').innerText = LoginManager.getUsername();
    document.getElementById('avatar').src = LoginManager.getAvatar();
  } else {
    document.getElementById('loginLoading').style.display = 'none';
    document.getElementById('loginLink').classList.remove('d-none');
  }
});

var lineDrawing = anime({
  targets: '.logo path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutCubic',
  duration: 1500,
  begin: function (anim) {
    document.querySelector('path').setAttribute('stroke', 'black');
    document.querySelector('path').setAttribute('fill', 'none');
  },
  complete: function (anim) {
    document.querySelector('path').setAttribute('fill', 'yellow');
  },
  autoplay: true,
});

var border = anime({
  targets: '.stroke',
  duration: 1500,
  delay: 1000,
  strokeWidth: ['3px', '0'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

var white = anime({
  targets: '.st0',
  duration: 1500,
  delay: 800,
  fill: ['#F2F2F2'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

var startColor = anime({
  targets: '#startColor',
  duration: 1500,
  delay: 800,
  stopColor: ['none', '#fd1414'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

var endColor = anime({
  targets: '#endColor',
  duration: 1500,
  delay: 800,
  stopColor: ['none', '#7c0d00'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

setColors();
setInterval(setColors, 5000 * (4 - 1));

function setColors() {
  setTimeout(function () {
    changeColor('#e29c25', '#db7220');

    setTimeout(function () {
      changeColor('#63a0d9', '#394f6b');

      setTimeout(function () {
        changeColor('#444', '#111');

        setTimeout(function () {
          changeColor('#fd1414', '#7c0d00');
        }, 5000);
      }, 5000);
    }, 5000);
  }, 5000);
}

function changeColor(startColor, endColor) {
  var white = anime({
    targets: '.st0',
    duration: 1500,
    delay: 1000,
    fill: ['#F2F2F2'],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });

  var startColor = anime({
    targets: '#startColor',
    duration: 1500,
    delay: 1000,
    stopColor: [startColor],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });

  var endColor = anime({
    targets: '#endColor',
    duration: 1500,
    delay: 1000,
    stopColor: [endColor],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });
}
