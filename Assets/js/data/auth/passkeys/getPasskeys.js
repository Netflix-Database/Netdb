export async function getPasskeys() {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/passkeys`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
