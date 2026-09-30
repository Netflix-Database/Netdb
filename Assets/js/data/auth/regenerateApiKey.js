export async function regenerateApiKey(clientId) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/apikey`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientId),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
