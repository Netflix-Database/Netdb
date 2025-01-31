export async function getTrustedClients() {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/oauth/trust`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + LoginManager.getCookie('token'),
    },
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
