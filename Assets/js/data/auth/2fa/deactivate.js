export async function deactivate(password, mfaToken) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/2fa/deactivate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Password: password,
      MFAToken: mfaToken,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
