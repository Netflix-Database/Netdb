var currentUser;

LoginManager.isLoggedIn().then(async (e) => {
  if (!e) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const token = LoginManager.getCookie('token');

  const req = await fetch('https://api.login.netdb.at/user', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  const user = res.data;
  currentUser = user;

  document.getElementById('username').value = user.username;
  document.getElementById('firstname').value = user.firstname;
  document.getElementById('lastname').value = user.lastname;
  document.getElementById('pi_email').value = user.email;
  document.getElementById('cp_email').value = user.email;
  document.getElementById('country').value = user.country;
  document.getElementById('preferredlang').value = user.preferredLang;

  if (user.discordId !== null) document.getElementById('ca_discord').classList.add('connected');

  if (user.sporifyId !== null) document.getElementById('ca_spotify').classList.add('connected');

  if (user.twitchId !== null) document.getElementById('ca_twitch').classList.add('connected');

  // if (user.githubId !== null)
  //   document.getElementById("ca_github").classList.add("connected");

  // if (user.googleId !== null)
  //   document.getElementById("ca_google").classList.add("connected");

  // if (user.appleId !== null)
  //   document.getElementById("ca_apple").classList.add("connected");

  if (user['2fa'] && user['2faType'] == 'App') document.getElementById('cp_2fa').classList.remove('d-none');
});

document.getElementById('pi_save').addEventListener('click', savePersonalInformation);
document.getElementById('cp_save').addEventListener('click', changePassword);

document.getElementsByTagName('input').forEach((element) => {
  element.addEventListener('keyup', (e) => e.target.classList.remove('invalid'));
});

async function savePersonalInformation() {
  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/user', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      country: document.getElementById('country').value,
      preferredLang: document.getElementById('preferredlang').value,
      username: document.getElementById('username').value,
    }),
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }
}

async function changePassword() {
  //move to /user/password

  const pw = document.getElementById('newPassword1').value;
  const rpw = document.getElementById('newPassword2').value;

  const error = validatePw(pw, rpw);

  if (error) {
    document.getElementById('newPassword1').value = '';
    document.getElementById('newPassword2').value = '';

    document.getElementById('newPassword1').classList.add('invalid');
    document.getElementById('newPassword2').classList.add('invalid');
    return;
  }

  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/resetpassword', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      OldPassword: document.getElementById('oldPassword').value,
      Email: document.getElementById('cp_email').value,
      Password: document.getElementById('newPassword1').value,
      TwoFaToken: currentUser['2fa'] ? document.getElementById('cp_2fa').value : null,
    }),
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at';
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  window.location.href = 'https://login.netdb.at/?redirect=' + encodeURIComponent(window.location.href);
}

function validatePw(pw, rpw) {
  if (pw.length < 8) return 'The password has to be at least 8 characters long';

  if (!isUpperCase(pw)) return 'The password has to contain at least one uppercase letter';

  if (!isLowerCase(pw)) return 'The password has to contain at least one lowercase letter';

  if (!isNumber(pw)) return 'The password has to contain at least one number';

  if (pw != rpw) return 'Passwords do not match';
}

function isUpperCase(str) {
  return /[A-Z]/.test(str);
}

function isLowerCase(str) {
  return /[a-z]/.test(str);
}

function isNumber(str) {
  return /[0-9]/.test(str);
}
