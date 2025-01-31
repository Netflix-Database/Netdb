export async function linkSocialAccount(provider, code) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/link/` + provider + '?code=' + code, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
