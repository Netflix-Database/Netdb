export async function getPasskeys() {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/passkey`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
