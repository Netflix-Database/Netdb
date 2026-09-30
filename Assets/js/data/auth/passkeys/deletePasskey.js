export async function deletePasskey(id) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/passkey`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: `"${id}"`,
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
