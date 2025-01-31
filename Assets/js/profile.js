import { initSearchbar } from './autocomplete';
import { createDialog, initDialog } from './dialog';
import { initLocalization } from './util/localization';
import { validateMfaToken, validatePw } from './util/validation';
import { deleteAccount as deleteAccountReq } from './data/auth/deleteAccount';
import { unlinkSocialAccount as unlinkSocialAccountReq } from './data/auth/unlinkSocialAccount';
import { deactivate as deactivateMfaReq } from './data/auth/2fa/deactivate';
import { verify as verifyMfaReq } from './data/auth/2fa/verify';
import { activate as activateMfaReq } from './data/auth/2fa/activate';
import { changePassword as changePasswordReq } from './data/auth/changePassword';
import { saveClient as saveClientReq } from './data/auth/oauth/saveClient';
import { getUser } from './data/auth/getUser';
import { getApiKeys } from './data/auth/getApiKeys';
import { createApiKey as createApiKeyReq } from './data/auth/createApiKey';
import { getScopes } from './data/auth/getScopes';
import { saveUser } from './data/auth/saveUser';
import { deleteApiKey as deleteApiKeyReq } from './data/auth/deleteApiKey';
import { regenerateApiKey as regenerateApiKeyReq } from './data/auth/regenerateApiKey';
import { addRedirect } from './data/auth/oauth/addRedirect';
import { deleteRedirect } from './data/auth/oauth/deleteRedirect';
import { deleteClient } from './data/auth/oauth/deleteClient';
import { createClient } from './data/auth/oauth/createClient';
import { getClients } from './data/auth/oauth/getClients';
import { getTrustedClients } from './data/auth/oauth/getTrustedClients';
import { untrustClient } from './data/auth/oauth/untrustClient';
import { linkSocialAccount } from './data/auth/linkSocialAccount';

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
  { key: 'tr-tr', name: 'Turkish' },
  { key: 'zh-cn', name: 'Chinese' },
  { key: 'ja-jp', name: 'Japanese' },
  { key: 'ko-kr', name: 'Korean' },
  { key: 'ar-sa', name: 'Arabic' },
  { key: 'hi-in', name: 'Hindi' },
  { key: 'no-no', name: 'Norwegian' },
  { key: 'sv-se', name: 'Swedish' },
  { key: 'fi-fi', name: 'Finnish' },
  { key: 'da-dk', name: 'Danish' },
  { key: 'cs-cz', name: 'Czech' },
  { key: 'hu-hu', name: 'Hungarian' },
  { key: 'el-gr', name: 'Greek' },
  { key: 'th-th', name: 'Thai' },
  { key: 'id-id', name: 'Indonesian' },
  { key: 'ro-ro', name: 'Romanian' },
  { key: 'sk-sk', name: 'Slovak' },
  { key: 'uk-ua', name: 'Ukrainian' },
  { key: 'bg-bg', name: 'Bulgarian' },
  { key: 'hr-hr', name: 'Croatian' },
  { key: 'ca-es', name: 'Catalan' },
  { key: 'et-ee', name: 'Estonian' },
  { key: 'fa-ir', name: 'Persian' },
  { key: 'he-il', name: 'Hebrew' },
  { key: 'is-is', name: 'Icelandic' },
  { key: 'lt-lt', name: 'Lithuanian' },
  { key: 'lv-lv', name: 'Latvian' },
  { key: 'sr-rs', name: 'Serbian' },
  { key: 'sl-si', name: 'Slovenian' },
  { key: 'vi-vn', name: 'Vietnamese' },
  { key: 'xx-ms', name: 'Wingdings' },
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
  { key: 'nl', name: 'Netherlands' },
  { key: 'pt', name: 'Portugal' },
  { key: 'ru', name: 'Russia' },
  { key: 'tr', name: 'Turkey' },
  { key: 'cn', name: 'China' },
  { key: 'jp', name: 'Japan' },
  { key: 'kr', name: 'Korea' },
  { key: 'ar', name: 'Argentina' },
  { key: 'au', name: 'Australia' },
  { key: 'be', name: 'Belgium' },
];
var currentUser;

initLocalization();
initDialog();
document.getElementById('pi_save').addEventListener('click', savePersonalInformation);
document.getElementById('cp_save').addEventListener('click', changePassword);
document.getElementById('createApiKey').addEventListener('click', createApiKey);
document.getElementById('ca_spotify_link').addEventListener('click', () => LinkAccounts('spotify'));
document.getElementById('ca_twitch_link').addEventListener('click', () => LinkAccounts('twitch'));
document.getElementById('ca_discord_link').addEventListener('click', () => LinkAccounts('discord'));
document.getElementById('ca_google_link').addEventListener('click', () => LinkAccounts('google'));
document.getElementById('ca_github_link').addEventListener('click', () => LinkAccounts('github'));
document.getElementById('logout').addEventListener('click', async () => {
  await LoginManager.logout();
  window.location.href = LoginManager.buildLoginUrl(window.location.href);
});
document.getElementById('deleteAccount').addEventListener('click', async (e) => await doubleClickButton(e, deleteAccount));
document.getElementById('createSsoCredentials').addEventListener('click', async () => await createSsoCredentials());

LoginManager.isLoggedIn().then(async (e) => {
  if (!e && import.meta.env.MODE !== 'development') {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  const token = LoginManager.getCookie('token');
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('code')) {
    const code = urlParams.get('code');

    LinkAccount(code);
  }

  if (import.meta.env.MODE === 'development') {
    const user = {
      username: 'TestUser',
      firstname: 'Test',
      lastname: 'User',
      email: 'amogus@example.com',
      country: 'at',
      preferredLang: 'de-at',
      discordId: null,
      spotifyId: null,
      twitchId: null,
      githubId: null,
      googleId: null,
      '2fa': false,
      '2faType': 'App',
      api_keys: [
        {
          clientId: "1234567890",
          scope: "admin"
        }
      ],
      trusted_sso_clients: [
        {
          id: '1234567890',
          name: 'TestClient',
          logo: 'https://via.placeholder.com/150',
        },
      ],
      sso_clients: [
        {
          id: '1234567890',
          name: 'TestClient',
          logo: 'https://via.placeholder.com/150',
          url: 'https://example.com',
          secret: '1234567890',
          redirects: [
            {
              id: '1234567890',
              url: 'https://example.com',
            },
          ],
        },
      ],
    };

    currentUser = user;
  } else {
    const userReq = await getUser();
    const userResponse = await userReq.json();

    if (userResponse.statusCode != 200) {
      console.log(userResponse);
      return;
    }

    const apiKeyReq = await getApiKeys();
    const apiKeyResponse = await apiKeyReq.json();

    if (apiKeyResponse.statusCode != 200) {
      console.log(apiKeyResponse);
      return;
    }

    const SSOreq = await getClients();
    const SSOResponse = await SSOreq.json();

    if (SSOResponse.statusCode != 200) {
      console.log(SSOreq);
      return;
    }

    const trustedClientsReq = await getTrustedClients();
    const trustedClientsResponse = await trustedClientsReq.json();

    if (trustedClientsResponse.statusCode != 200) {
      console.log(SSOreq);
      return;
    }

    const user = {
      ...userResponse.data,
      api_keys: apiKeyResponse.data,
      trusted_sso_clients: trustedClientsResponse.data,
      sso_clients: SSOResponse.data,
    };
    currentUser = user;
  }

  document.getElementById('username').value = currentUser.username;
  document.getElementById('firstname').value = currentUser.firstname;
  document.getElementById('lastname').value = currentUser.lastname;
  document.getElementById('pi_email').value = currentUser.email;
  document.getElementById('cp_email').value = currentUser.email;
  document.getElementById('country').dataset.key = currentUser.country;
  document.getElementById('preferredlang').dataset.key = currentUser.preferredLang;

  if (currentUser.discordId !== null) document.getElementById('ca_discord').classList.add('connected');

  if (currentUser.spotifyId !== null) document.getElementById('ca_spotify').classList.add('connected');

  if (currentUser.twitchId !== null) document.getElementById('ca_twitch').classList.add('connected');

  if (currentUser.githubId !== null) document.getElementById('ca_github').classList.add('connected');

  if (currentUser.googleId !== null) document.getElementById('ca_google').classList.add('connected');

  Array.from(document.getElementsByClassName('connected')).forEach((element) => {
    element.addEventListener('click', disconnectAccount);
  });

  if (currentUser['2fa'] && currentUser['2faType'] == 'App') document.getElementById('cp_2fa').classList.remove('d-none');

  if (currentUser['2fa']) {
    document.getElementById('2fa_status').innerText = 'Enabled';
    document.getElementById('2fa_type').value = currentUser['2faType'] == 'App' ? 0 : currentUser['2faType'] == 'Mail' ? 1 : 2;
    document.getElementById('2fa_type').disabled = true;
    document.getElementById('2fa_enable').innerText = 'Disable';
    document.getElementById('2fa_enable').addEventListener('click', disable2fa);
  } else {
    document.getElementById('2fa_enable').addEventListener('click', enable2fa);
  }

  initSearchbar(countries, 'country_search');
  initSearchbar(languages, 'language_search');

  currentUser.api_keys.forEach((key) => {
    document.getElementById('apiKeysTable').appendChild(createApiKeyRow(key.clientId, key.scope));
  });

  if (currentUser.trusted_sso_clients.length > 0) document.getElementById('thirdPartyAppsContainer').innerHTML = '';

  currentUser.trusted_sso_clients.forEach((client) => {
    const row = document.createElement('div');
    row.id = 'trusted_' + client.id;
    const img = document.createElement('img');
    img.src = client.logo;
    img.alt = client.name;
    img.title = client.name;
    row.appendChild(img);
    const name = document.createElement('h1');
    name.innerText = client.name;
    row.appendChild(name);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', async () => await deleteTrustedSsoClient(client.id));
    row.appendChild(deleteBtn);
    document.getElementById('thirdPartyAppsContainer').appendChild(row);
  });

  if (currentUser.sso_clients.length > 0) document.getElementById('ssoClientsContainer').innerHTML = '';

  currentUser.sso_clients.forEach((client) => {
    document.getElementById('ssoClientsContainer').appendChild(createSSOClient(client.logo, client.name, client.url, client.id, client.secret, client.redirects, client.audiences));
  });

  Array.from(document.getElementsByClassName('collapsible')).forEach((element) => {
    element.addEventListener('click', function () {
      this.classList.toggle('active');

      if (this.nextElementSibling.style.maxHeight) this.nextElementSibling.style.maxHeight = null;
      else this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px';
    });
  });

  Array.from(document.getElementsByTagName('input')).forEach((element) => {
    element.addEventListener('keyup', (e) => e.target.classList.remove('invalid'));
  });
});

async function LinkAccount(code) {
  const provider = localStorage.getItem('linkType');
  const req = await linkSocialAccount(provider, code);
  const res = await req.json();

  if (res.statusCode != 200) {
    createDialog('Error', 'An error occured while linking your account!', 'error');
    return;
  }

  localStorage.removeItem('linkType');
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete('code');

  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

  createDialog('Success', 'Account successfully linked!', 'info');
}

async function deleteTrustedSsoClient(clientId) {
  const req = await untrustClient(clientId);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  document.getElementById('trusted_' + clientId).remove();

  const container = document.getElementById('thirdPartyAppsContainer');

  if (container.children.length == 0)
    container.innerHTML = '<p>No third party apps connected!</p>';
}

async function createSsoCredentials() {
  document
    .getElementById('createSSODialog')
    .querySelectorAll('input')
    .forEach((element) => {
      element.value = '';
    });

  document.getElementById('createSSODialog').show();

  const canceled = await new Promise((resolve) => {
    document.getElementById('createSSODialog').addEventListener(
      'onHide',
      (e) => {
        if (e.detail.reason == 'canceled') {
          resolve(false);
          return;
        }

        resolve(true);
      },
      { once: true }
    );
  });

  if (!canceled) return;

  const name = document.getElementById('c_sso_name').value;
  const websiteUrl = document.getElementById('c_sso_url').value;
  const logoUrl = document.getElementById('c_sso_logoUrl').value;
  const req = await createClient(name, websiteUrl, logoUrl);
  const res = await req.json();

  if (req.status != 200 || res.statusCode != 203) {
    createDialog('Error', 'An error occured while creating the SSO credentials!', 'error');
    return;
  }

  if (document.getElementById('ssoClientsContainer').children[0].tagName == 'P') document.getElementById('ssoClientsContainer').innerHTML = '';

  const item = createSSOClient(logoUrl, name, websiteUrl, res.data.clientId, res.data.clientSecret, [], []);
  document.getElementById('ssoClientsContainer').appendChild(item);

  item.children[0].addEventListener('click', function () {
    item.classList.toggle('active');

    if (item.children[0].nextElementSibling.style.maxHeight) item.children[0].nextElementSibling.style.maxHeight = null;
    else item.children[0].nextElementSibling.style.maxHeight = item.children[0].nextElementSibling.scrollHeight + 'px';
  });
}

function createSSOClient(logoUrl, clientName, websiteUrl, clientId, clientSecret, redirects, audiences) {
  const template = document.importNode(document.getElementById('ssoCredentials').getElementsByTagName('template')[0].content, true);
  const item = template.querySelector('div');

  item.id = 'sso_' + clientId;
  item.querySelector('img').src = logoUrl;
  item.querySelector('img').alt = clientName;
  item.querySelector('img').title = clientName;
  item.querySelector('h1').innerText = clientName;
  item.querySelector('a').href = websiteUrl;
  item.querySelector('a').innerText = websiteUrl;

  const content = item.querySelector('.collapsible-content');
  content.querySelector('#sso_clientId').value = clientId;
  content.querySelector('#sso_clientSecret').value = clientSecret;
  content.querySelector('#sso_logoUrl').value = logoUrl;
  content.querySelector('#sso_websiteUrl').value = websiteUrl;
  content.querySelector('#sso_name').value = clientName;
  content.querySelector('#sso_save').addEventListener('click', async () => await saveSSOClient(clientId));
  item.querySelector('#sso_delete').addEventListener('click', async () => await deleteSSOClient(clientId));
  content.querySelector('#sso_addRedirect').addEventListener('click', async () => await addSSORedirect(clientId));
  content.querySelector('#sso_addAudience').addEventListener('click', async () => await addAudience(clientId));


  const audiencesContainer = content.querySelector('#sso_audiences');

  audiences.forEach((audience) => {
    const audienceItem = document.createElement('div');
    audienceItem.id = 'sso_audience_' + audience.id;

    const audienceInput = document.createElement('input');
    audienceInput.type = 'text';
    audienceInput.value = audience.audience;
    audienceInput.disabled = true;
    audienceItem.appendChild(audienceInput);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', async () => await deleteAudience(clientId, audience.id));
    audienceItem.appendChild(deleteBtn);

    audiencesContainer.appendChild(audienceItem);
  });

  const redirectsContainer = content.querySelector('#sso_redirects');

  redirects.forEach((redirect) => {
    const redirectItem = document.createElement('div');
    redirectItem.id = 'sso_redirect_' + redirect.id;

    const url = document.createElement('input');
    url.type = 'text';
    url.value = redirect.url;
    url.disabled = true;
    redirectItem.appendChild(url);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', async () => await deleteSSORedirect(clientId, redirect.id));
    redirectItem.appendChild(deleteBtn);

    redirectsContainer.appendChild(redirectItem);
  });

  return item;
}

async function deleteSSOClient(clientId) {
  const req = await deleteClient(clientId);
  const res = await req.json();

  if (req.status != 200 || res.statusCode != 200) {
    createDialog('Error', 'An error occured while deleting the SSO credentials!', 'error');
    return;
  }

  document.getElementById('sso_' + clientId).remove();
}

async function deleteSSORedirect(clientId, redirectId) {
  const req = await deleteRedirect(clientId, redirectId);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  document.getElementById('sso_redirect_' + redirectId).remove();
}

async function addSSORedirect(clientId) {
  const item = document.getElementById('sso_' + clientId);
  const redirects = item.querySelector('#sso_redirects');

  //TODO: add button feedback

  const req = await addRedirect(clientId, item.querySelector('#sso_addRedirect').previousElementSibling.value);
  const res = await req.json();

  if (res.statusCode != 203) {
    console.log(res);
    return;
  }

  item.querySelector('#sso_addRedirect').previousElementSibling.value = '';

  const redirect = document.createElement('div');
  redirect.id = 'sso_redirect_' + res.data.id;
  const url = document.createElement('input');
  url.type = 'text';
  url.value = res.data.url;
  url.disabled = true;
  redirect.appendChild(url);
  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.addEventListener('click', async () => await deleteSSORedirect(clientId, res.data.id));
  redirect.appendChild(deleteBtn);

  if (redirects.children.length > 1) {
    redirects.insertBefore(redirect, redirects.children[1]);
    return;
  }

  redirects.append(redirect);
}

async function saveSSOClient(clientId) {
  const item = document.getElementById('sso_' + clientId);
  const req = await saveClientReq(clientId, item.querySelector('#sso_logoUrl').value, item.querySelector('#sso_websiteUrl').value, item.querySelector('#sso_name').value);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    createDialog('Error', 'An error occured while saving the SSO credentials!', 'error');
    return;
  }

  displayButtonFeedback(item.querySelector('#sso_save'), 'success');
}

async function doubleClickButton(e, func) {
  if (e.target.dataset.clicked == 'true') {
    await func();
    return;
  }

  e.target.dataset.clicked = 'true';
  e.target.innerText = 'Confirm';

  setTimeout(() => {
    e.target.dataset.clicked = 'false';
    e.target.innerText = 'Delete Account';
  }, 3000);
}

function createApiKeyRow(client_id, scope) {
  const row = document.createElement('tr');
  row.id = client_id;
  row.innerHTML = `<td>${client_id}</td><td>${scope}</td>`;
  const td = document.createElement('td');
  const deleteBtn = document.createElement('button');
  const regenBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  regenBtn.innerText = 'Regenerate';

  deleteBtn.addEventListener('click', () => deleteApiKey(client_id));
  regenBtn.addEventListener('click', () => regenerateApiKey(client_id));

  td.appendChild(regenBtn);
  td.appendChild(deleteBtn);
  row.appendChild(td);

  return row;
}

async function createApiKey() {
  document.getElementById('scope').value = '';
  document.getElementById('apiKeyDialog').show();

  const dialogRes = await new Promise((resolve) => {
    document.getElementById('apiKeyDialog').addEventListener(
      'onHide',
      (e) => {
        if (e.detail.reason == 'canceled') {
          resolve(false);
          return;
        }

        resolve(true);
      },
      { once: true }
    );
  });

  if (!dialogRes) return false;

  const scope = document.getElementById('scope').value;
  const availableScopes = await getScopes();

  if (scope.length == 0) {
    createDialog('Error', 'Please fill out all fields!', 'error');
    return;
  }

  const inputScopes = input.split(' ');
  for (const inputScope of inputScopes) {
    const [category, scopeValue] = inputScope.split(':');
    const categoryScopes = availableScopes.find(sc => sc.category === category);
    if (!categoryScopes) {
      createDialog('Error', `Invalid category: ${category}`, 'error');
      return false;
    }

    const scopeExists = categoryScopes.scopes.some(sc => sc.value == scopeValue);
    if (!scopeExists) {
      createDialog('Error', `Invalid scope value: ${scopeValue} for category: ${category}`, 'error');
      return false;
    }
  }

  const req = await createApiKeyReq(scope);
  const res = await req.json();

  if (res.statusCode != 203) {
    console.log(res);
    createDialog('Error', 'An error occured while creating the API key!', 'error');
    return;
  }

  document.getElementById('apiKeysTable').appendChild(createApiKeyRow(res.data.clientId, res.data.scope));

  createDialog('Success', 'Successfully created API key! Please save it now, as it will not be shown again! ' + res.data.clientSecret, 'info');
}

async function regenerateApiKey(clientId) {
  const req = await regenerateApiKeyReq(clientId);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    createDialog('Error', 'An error occured while regenerating the API key!', 'error');
    return;
  }

  createDialog('Success', 'Successfully regenerated API key! Please save it now, as it will not be shown again! ' + res.data.clientSecret, 'info');
}

async function deleteApiKey(clientId) {
  const req = await deleteApiKeyReq(clientId);
  const data = await req.json();

  if (data.statusCode != 200) {
    console.log(data);
    createDialog('Error', 'An error occured while deleting the API key!', 'error');
    return;
  }

  document.getElementById(clientId).remove();
}

function LinkAccounts(type) {
  localStorage.setItem('linkType', type);

  switch (type) {
    case 'spotify': {
      window.location.href = 'https://accounts.spotify.com/de/authorize?client_id=a7c2014c0531405983d7050277dee3cb&response_type=code&redirect_uri=https://netdb.at/profile&scope=user-read-private%20user-read-email';
      break;
    }
    case 'discord': {
      window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=802237562625196084&redirect_uri=https://netdb.at/profile&response_type=code&scope=identify%20email';
      break;
    }
    case 'twitch': {
      window.location.href = 'https://id.twitch.tv/oauth2/authorize?client_id=okxhfdyyoyx724c5zf0h869x9ry1sx&redirect_uri=https://netdb.at/profile&response_type=code&scope=user_read';
      break;
    }
    case 'github': {
      window.location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=de5e22518d66ab50a805';
      break;
    }
    case 'google': {
      window.location.href =
        'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https://netdb.at/profile&client_id=736018590984-nh2ifch6ps8art9v35avipv16se1b720.apps.googleusercontent.com';
      break;
    }
  }
}

async function savePersonalInformation() {
  const req = await saveUser(document.getElementById('firstname').value, document.getElementById('lastname').value, document.getElementById('country').dataset.key, document.getElementById('preferredlang').dataset.key, document.getElementById('username').value);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    displayButtonFeedback(document.getElementById('pi_save'), 'error');
    return;
  }

  displayButtonFeedback(document.getElementById('pi_save'), 'success');
}

function displayButtonFeedback(btn, type) {
  btn.classList.add(type);

  setTimeout(() => {
    btn.classList.remove(type);
  }, 1500);
}

async function changePassword() {
  const pw = document.getElementById('newPassword1').value;
  const rpw = document.getElementById('newPassword2').value;
  const oldPw = document.getElementById('oldPassword').value;
  const email = document.getElementById('cp_email').value;

  const error = validatePw(oldPw, pw, rpw);

  if (error) {
    document.getElementById('newPassword1').value = '';
    document.getElementById('newPassword2').value = '';

    document.getElementById('newPassword1').classList.add('invalid');
    document.getElementById('newPassword2').classList.add('invalid');

    createDialog('Error', error, 'error');
    return;
  }

  const req = await changePasswordReq(oldPw, email, pw, currentUser['2fa'] ? document.getElementById('cp_2fa').value : null);
  const res = await req.json();

  if (res.statusCode != 200) {
    console.log(res);
    return;
  }

  LoginManager.deleteCookie('token');
  LoginManager.deleteCookie('refreshToken');
  window.location.href = LoginManager.buildLoginUrl(window.location.href);
}

async function disconnectAccount(e) {
  const element = e.target.closest('[data-type]');

  await unlinkSocialAccountReq(element.dataset.type);

  element.classList.remove('connected');
}

async function deleteAccount() {
  const creds = await getCreds(true);

  if (!creds) return;

  const req = await deleteAccountReq(creds.password, creds.mfaToken);

  const data = await req.json();

  if (data.statusCode != 200) {
    createDialog('Error', 'An error occured while deleting your account!', 'error');
    return;
  }

  LoginManager.deleteCookie('token', '/', '.' + LoginManager.domain);
  LoginManager.deleteCookie('refreshToken', '/', '.' + LoginManager.domain);
  window.location.href = LoginManager.buildLoginUrl(window.location.href);
}

async function enable2fa() {
  const mfaType = document.getElementById('2fa_type').value;

  if (mfaType == 2) {
    alert('Select a valid 2FA type!');
    return;
  }

  const req = await activateMfaReq(mfaType == 0 ? '"app"' : mfaType == 1 ? '"mail"' : null);

  if (req.status != 200) {
    createDialog('Error', 'An error occured while enabling 2FA!', 'error');
    return;
  }

  const res = await req.json();

  if (mfaType == 0) { //App
    const qr = res.data.qrCodeSetupImageUrl;
    const secret = res.data.manualEntryKey;

    document.getElementById('authenticatorDialog').querySelector('img').src = qr;
    document.getElementById('authenticatorDialog').querySelector('h1').innerText = secret;
    document.getElementById('authenticatorDialog').show();

    const canceled = await new Promise((resolve) => {
      document.getElementById('authenticatorDialog').addEventListener(
        'onHide',
        (e) => {
          if (e.detail.reason == 'canceled') {
            resolve(false);
            return;
          }

          resolve(true);
        },
        { once: true }
      );
    });

    if (!canceled) return false;
  }

  await verify2fa();
}

async function verify2fa() {
  const creds = await getCreds(true, false, true);

  if (!creds) return;

  const req = await verifyMfaReq(creds.password, creds.mfaToken);

  if (req.status != 200) {
    createDialog('Error', 'An error occured while verifying 2FA!', 'error');
    return false;
  }

  const res = await req.json();

  if (res.statusCode != 200) {
    createDialog('Error', 'An error occured while verifying 2FA!', 'error');
    return false;
  }

  createDialog('Success', '2FA successfully enabled!', 'info');
}

async function disable2fa() {
  const creds = await getCreds(true);

  if (!creds) return;

  let req = await deactivateMfaReq(creds.password, creds.mfaToken);
  const res = await req.json();

  if (req.status != 200 || res.statusCode != 200) {
    createDialog('Error', 'An error occured while disabling 2FA!', 'error');
    return;
  }

  if (!res.statusCode == 409) {
    const mfaToken = await getCreds(true, true);

    if (!mfaToken) return;

    req = await disableMfaRequest(creds.password, mfaToken.mfaToken);

    if (req.status != 200 || res.statusCode != 200) {
      createDialog('Error', 'An error occured while disabling 2FA!', 'error');
      return;
    }
  }
}

async function getCreds(mfa = false, mfaOnly = false, forceMfa = false) {
  document.getElementById('passwordInput').value = '';
  document.getElementById('2faInput').value = '';

  if ((mfa && (currentUser['2faType'] == 'App' || mfaOnly)) || forceMfa) document.getElementById('2faInput').classList.remove('d-none');
  else document.getElementById('2faInput').classList.add('d-none');

  if (mfaOnly) document.getElementById('passwordInput').classList.add('d-none');
  else document.getElementById('passwordInput').classList.remove('d-none');

  document.getElementById('passwordDialog').show();

  const res = await new Promise((resolve) => {
    document.getElementById('passwordDialog').addEventListener(
      'onHide',
      (e) => {
        if (e.detail.reason == 'canceled') {
          resolve(false);
          return;
        }

        resolve(true);
      },
      { once: true }
    );
  });

  if (!res) return false;

  const pw = document.getElementById('passwordInput').classList.contains('d-none') ? null : document.getElementById('passwordInput').value;
  const mfaToken = document.getElementById('2faInput').classList.contains('d-none') ? null : document.getElementById('2faInput').value;

  if (pw != null && validatePw(null, pw, pw)) {
    createDialog('Invalid password', 'The password you entered is invalid!', 'error');
    return false;
  }
  if (mfaToken != null && !validateMfaToken(mfaToken)) {
    createDialog('Invalid 2FA token', 'The 2FA token you entered is invalid!', 'error');
    return false;
  }

  return {
    password: pw,
    mfaToken: mfaToken,
  };
}
