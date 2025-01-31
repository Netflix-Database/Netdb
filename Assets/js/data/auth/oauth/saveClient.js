export async function saveClient(clientId, logoUrl, url, name) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/oauth`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId,
      logoUrl: logoUrl,
      url: url,
      name: name,
    }),
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
