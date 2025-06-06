export async function untrustClient(clientId) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/oauth/untrust`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: `"${clientId}"`,
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
