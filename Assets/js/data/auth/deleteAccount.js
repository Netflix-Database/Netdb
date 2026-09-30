export async function deleteAccount(password, mfaToken) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Password: password,
      TwoFaToken: mfaToken,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
