export async function logoutAllDevices() {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/revoke/all`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
    },
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
