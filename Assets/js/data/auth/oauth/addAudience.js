export async function addAudience(clientId, url) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/oauth/audiences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
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
