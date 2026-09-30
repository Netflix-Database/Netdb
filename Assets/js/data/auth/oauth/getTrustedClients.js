export async function getTrustedClients() {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/oauth/trust`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
    },
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
