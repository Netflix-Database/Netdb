const languages = [
  { key: 'en-us', name: 'English' },
  { key: 'de-at', name: 'German' },
  { key: 'fr-fr', name: 'French' },
  { key: 'it-it', name: 'Italian' },
  { key: 'es-es', name: 'Spanish' },
  { key: 'pl-pl', name: 'Polish' },
  { key: 'nl-nl', name: 'Dutch' },
  { key: 'pt-pt', name: 'Portuguese' },
  { key: 'ru-ru', name: 'Russian' },
  { key: 'tr-tr', name: 'Turkish' }
];
const countries = [
  { key: 'at', name: 'Austria' },
  { key: 'de', name: 'Germany' },
  { key: 'ch', name: 'Switzerland' },
  { key: 'us', name: 'United States' },
  { key: 'gb', name: 'United Kingdom' },
  { key: 'fr', name: 'France' },
  { key: 'it', name: 'Italy' },
  { key: 'es', name: 'Spain' },
  { key: 'pl', name: 'Poland' },
  { key: 'nl', name: 'Netherlands' }
];
var currentUser;

LoginManager.isLoggedIn().then(async (e) => {
  if (!e) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  const token = LoginManager.getCookie('token');

  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('code')) {
    const code = urlParams.get('code');
    const provider = localStorage.getItem('linkType');

    const req = await fetch('https://api.login.netdb.at/link/' + provider + '?code=' + code, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    if (req.status == 401) {
      window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
      return;
    }

    localStorage.removeItem('linkType');
    urlParams.delete('code');

    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

    //show account linked msg
  }

  const req = await fetch('https://api.login.netdb.at/user', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
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
  document.getElementById('country').dataset.key = user.country;
  document.getElementById('preferredlang').dataset.key = user.preferredLang;

  if (user.discordId !== null) document.getElementById('ca_discord').classList.add('connected');

  if (user.spotifyId !== null) document.getElementById('ca_spotify').classList.add('connected');

  if (user.twitchId !== null) document.getElementById('ca_twitch').classList.add('connected');

  // if (user.githubId !== null)
  //   document.getElementById("ca_github").classList.add("connected");

  // if (user.googleId !== null)
  //   document.getElementById("ca_google").classList.add("connected");

  // if (user.appleId !== null)
  //   document.getElementById("ca_apple").classList.add("connected");

  Array.from(document.getElementsByClassName('connected')).forEach((element) => {
    element.addEventListener('click', disconnectAccount);
  });

  if (user['2fa'] && user['2faType'] == 'App') document.getElementById('cp_2fa').classList.remove('d-none');

  if (user['2fa']) 
    document.getElementById('2fa_enable').checked = true;
  else
    document.getElementById('2fa_disnable').checked = true;

  initSearchbar(countries, "country_search");
  initSearchbar(languages, "language_search");

  user.api_keys.forEach((key) => {
    document.getElementById('apiKeysTable').appendChild(createApiKeyRow(key.client_id, "*************"));
  });
});

document.getElementById('pi_save').addEventListener('click', savePersonalInformation);
document.getElementById('cp_save').addEventListener('click', changePassword);
document.getElementById('ca_spotify_link').addEventListener('click', () => LinkAccounts("spotify"));
document.getElementById('ca_twitch_link').addEventListener('click', () => LinkAccounts("twitch"));
document.getElementById('ca_discord_link').addEventListener('click', () => LinkAccounts("discord"));
document.getElementById('ca_google_link').addEventListener('click', () => LinkAccounts("google"));
document.getElementById('ca_apple_link').addEventListener('click', () => LinkAccounts("apple"));
document.getElementById('ca_github_link').addEventListener('click', () => LinkAccounts("github"));
document.getElementById('logout').addEventListener('click', () => LoginManager.logout());
document.getElementById('createApiKey').addEventListener('click', createApiKey);

Array.from(document.getElementsByTagName('input')).forEach((element) => {
  element.addEventListener('keyup', (e) => e.target.classList.remove('invalid'));
});

function createApiKeyRow(client_id, client_secret) {
  const row = document.createElement('tr');
  row.id = client_id;
  row.innerHTML = '<td>' + client_id + '</td><td>' + client_secret + '</td>';
  const td = document.createElement('td');
  const deleteBtn = document.createElement('button');
  const regenBtn = document.createElement('button');

  deleteBtn.addEventListener('click', () => deleteApiKey(client_id));
  regenBtn.addEventListener('click', () => regenerateApiKey(client_id));

  td.appendChild(regenBtn);
  td.appendChild(deleteBtn);
  row.appendChild(td);

  return row;
}

async function createApiKey() {
  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/user/apikey', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
    },
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  const res = await req.json();

  if (res.statusCode != 203) {
    console.log(res);
    return;
  }

  document.getElementById('apiKeysTable').appendChild(createApiKeyRow(res.client_id, res.client_secret));
}

async function regenerateApiKey(clientId) {
  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/user/apikey', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: "\"" + clientId + "\"",
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  document.getElementById(clientId).children[1].innerText = res.client_secret;
}

async function deleteApiKey(clientId) {
  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/user/apikey', {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
    },
    body: "\"" + clientId + "\"",
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  document.getElementById(clientId).remove();
}

function LinkAccounts(type) {
  localStorage.setItem("linkType", type);

  switch (type) {
    case "spotify": {
      window.location.href = "https://accounts.spotify.com/de/authorize?client_id=a7c2014c0531405983d7050277dee3cb&response_type=code&redirect_uri=https://new.netdb.at/profile&scope=user-read-private%20user-read-email";
      break;
    }
    case "discord": {
      window.location.href = "https://discord.com/api/oauth2/authorize?client_id=802237562625196084&redirect_uri=https://new.netdb.at/profile&response_type=code&scope=identify%20email";
      break;
    }
    case "twitch": {
      window.location.href = "https://id.twitch.tv/oauth2/authorize?client_id=okxhfdyyoyx724c5zf0h869x9ry1sx&redirect_uri=https://new.netdb.at/profile&response_type=code&scope=user_read";
      break;
    }
    case "github": {
    }
    case "google": {
    }
    case "apple": {
    }
  }
}

function initSearchbar(data, id) {
  let searchbar = document.getElementById(id);
  let inputBox = searchbar.querySelector("input");

  if (inputBox.dataset.key)
    inputBox.value = data.find((e) => e.key == inputBox.dataset.key).name;

  showSuggestions(data, searchbar);

  inputBox.addEventListener("keyup", (e) => filterSearch(e.target.value, data, searchbar));
  inputBox.addEventListener("focus", () => searchbar.querySelector('.autocom-box').classList.add("active"));
  searchbar.addEventListener("focusout", (e) => {
    setTimeout(() => {
      searchbar.querySelector('.autocom-box').classList.remove("active");
    }, 100);
  });

  inputBox.onkeydown = (e) => {
    if (e.key == "Enter") {
      searchbar.querySelector('input').value = document.querySelector('.autocom-box h1').innerText;
      searchbar.querySelector('input').dataset.key = document.querySelector('.autocom-box h1').dataset.key;
    }
  };
}

function filterSearch(userData, data, searchbar) {
  const suggestions = [];

  for (var i = 0; i < data.length; i++) suggestions.push(data[i]);

  const emptyArray = suggestions.filter((data) => data.name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()));

  showSuggestions(emptyArray, searchbar);
}

function showSuggestions(list, searchbar) {
  list = list.map((data) => {
    return (data = '<h1 data-key="' + data.key + '">' + data.name + '</h1>');
  });

  let listData;
  if (!list.length) {
    // const userValue = searchbar.querySelector('input').value;
    // listData = '<h1>' + userValue + '</h1>';
  } else {
    listData = list.join('');
  }

  searchbar.querySelector('.autocom-box').innerHTML = listData;

  const allList = searchbar.querySelector('.autocom-box').querySelectorAll('h1');
  for (let i = 0; i < allList.length; i++)
    allList[i].addEventListener('click', (e) => {
      searchbar.querySelector('input').value = e.target.innerText;
      searchbar.querySelector('input').dataset.key = e.target.dataset.key;
    });
}

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
      country: document.getElementById('country').dataset.key,
      preferredLang: document.getElementById('preferredlang').dataset.key,
      username: document.getElementById('username').value,
    }),
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }
}

async function changePassword() {
  const pw = document.getElementById('newPassword1').value;
  const rpw = document.getElementById('newPassword2').value;
  const oldPw = document.getElementById('oldPassword').value;

  const error = validatePw(oldPw, pw, rpw);

  if (error) {
    document.getElementById('newPassword1').value = '';
    document.getElementById('newPassword2').value = '';

    document.getElementById('newPassword1').classList.add('invalid');
    document.getElementById('newPassword2').classList.add('invalid');

    alert(error);
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
      OldPassword: oldPw,
      Email: document.getElementById('cp_email').value,
      Password: pw,
      TwoFaToken: currentUser['2fa'] ? document.getElementById('cp_2fa').value : null,
    }),
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  LoginManager.deleteCookie("token");
  LoginManager.deleteCookie("refreshToken");
  window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
}

function validatePw(oldPw, pw, rpw) {
  if (pw.length < 8) return 'The password has to be at least 8 characters long';

  if (!isUpperCase(pw)) return 'The password has to contain at least one uppercase letter';

  if (!isLowerCase(pw)) return 'The password has to contain at least one lowercase letter';

  if (!isNumber(pw)) return 'The password has to contain at least one number';

  if (pw != rpw) return 'Passwords do not match';

  if (pw == oldPw) return 'The new password cannot be the same as the old one';
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

async function disconnectAccount(e) {
  const element = e.target.closest('[data-type]');

  await LoginManager.validateToken();
  const req = await fetch('https://api.login.netdb.at/unlink/' + element.dataset.type, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + LoginManager.getCookie("token"),
    }
  });

  if (req.status == 401) {
    window.location.href = 'https://login.netdb.at?redirect=' + encodeURIComponent(window.location.href);
    return;
  }

  element.classList.remove('connected');
}