import { animate, createDrawable } from 'animejs';
import { initLocalization } from './util/localization';

initLocalization();

LoginManager.isLoggedIn().then(async (e) => {
  if (e) {
    document.getElementById('loginLoading').style.display = 'none';
    document.getElementById('profile').classList.remove('d-none');

    document.getElementById('username').innerText = LoginManager.getUsername();
    document.getElementById('avatar').src = LoginManager.getAvatarURL();
  } else {
    document.getElementById('loginLoading').style.display = 'none';
    document.getElementById('loginLink').classList.remove('d-none');
  }
});

animate(createDrawable('.logo path'), {
  draw: '0 1',
  ease: 'inOutCubic',
  duration: 1500,
  autoplay: true,
});

animate('.logo .stroke', {
  duration: 1500,
  delay: 1000,
  strokeWidth: ['3px', '0'],
  ease: 'inOutQuad',
});

animate('.logo .st0', {
  duration: 1500,
  delay: 800,
  fill: '#F2F2F2',
  ease: 'inOutQuad',
});

animate('#startColor', {
  duration: 1500,
  delay: 800,
  stopColor: ['#fff0', '#fd1414'],
  ease: 'inOutQuad',
});

animate('#endColor', {
  duration: 1500,
  delay: 800,
  stopColor: ['#fff0', '#7c0d00'],
  ease: 'inOutQuad',
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
  animate('.st0', {
    duration: 1500,
    delay: 1000,
    fill: '#F2F2F2',
    ease: 'inOutQuad',
  });

  animate('#startColor', {
    duration: 1500,
    delay: 1000,
    stopColor: [startColor],
    ease: 'inOutQuad',
  });

  animate('#endColor', {
    duration: 1500,
    delay: 1000,
    stopColor: [endColor],
    ease: 'inOutQuad',
  });
}
