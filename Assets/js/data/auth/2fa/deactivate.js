export async function deactivate(password, mfaToken) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/2fa/deactivate`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Password: password,
      MFAToken: mfaToken,
    }),
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
