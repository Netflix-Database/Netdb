export async function activate(mfaType) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/2fa/activate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: mfaType,
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
