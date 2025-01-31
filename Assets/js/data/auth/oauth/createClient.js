export async function createClient(name, websiteUrl, logoUrl) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/oauth`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      url: websiteUrl,
      logoUrl: logoUrl,
    }),
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
