export async function deleteRedirect(clientId, redirectId) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/oauth/redirects`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId,
      redirectId: redirectId,
    }),
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
