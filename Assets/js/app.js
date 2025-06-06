import anime from 'animejs';
import { initLocalization } from './util/localization';

initLocalization();

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

anime({
  targets: '.logo path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutCubic',
  duration: 1500,
  begin: function () {
    document.querySelector('path').setAttribute('stroke', 'black');
    document.querySelector('path').setAttribute('fill', 'none');
  },
  complete: function () {
    document.querySelector('path').setAttribute('fill', 'yellow');
  },
  autoplay: true,
});

anime({
  targets: '.stroke',
  duration: 1500,
  delay: 1000,
  strokeWidth: ['3px', '0'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

anime({
  targets: '.st0',
  duration: 1500,
  delay: 800,
  fill: ['#F2F2F2'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

anime({
  targets: '#startColor',
  duration: 1500,
  delay: 800,
  stopColor: ['none', '#fd1414'],
  direction: 'forward',
  easing: 'easeInOutQuad',
});

anime({
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
  setTimeout(() => {
    changeColor('#e29c25', '#db7220');

    setTimeout(() => {
      changeColor('#63a0d9', '#394f6b');

      setTimeout(() => {
        changeColor('#444', '#111');

        setTimeout(() => {
          changeColor('#fd1414', '#7c0d00');
        }, 5000);
      }, 5000);
    }, 5000);
  }, 5000);
}

function changeColor(startColor, endColor) {
  anime({
    targets: '.st0',
    duration: 1500,
    delay: 1000,
    fill: ['#F2F2F2'],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });

  anime({
    targets: '#startColor',
    duration: 1500,
    delay: 1000,
    stopColor: [startColor],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });

  anime({
    targets: '#endColor',
    duration: 1500,
    delay: 1000,
    stopColor: [endColor],
    direction: 'forward',
    easing: 'easeInOutQuad',
  });
}
