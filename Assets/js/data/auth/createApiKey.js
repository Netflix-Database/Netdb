export async function createApiKey(label, scope) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/apikey`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label, scope }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
