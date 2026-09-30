export async function unlinkSocialAccount(provider) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/unlink/${provider}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
    },
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
