export async function createClient(name, websiteUrl, logoUrl) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/oauth`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      url: websiteUrl,
      logoUrl: logoUrl,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
