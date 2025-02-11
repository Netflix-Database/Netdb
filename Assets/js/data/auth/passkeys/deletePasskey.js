export async function deletePasskey(id) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/passkey`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: `"${id}"`
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
