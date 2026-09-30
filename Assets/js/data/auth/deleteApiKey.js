export async function deleteApiKey(clientId) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/apikey`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: `"${  clientId  }"`,
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
