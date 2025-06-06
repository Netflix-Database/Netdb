export async function addRedirect(clientId, url) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/oauth/redirects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId,
      url: url,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
