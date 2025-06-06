export async function unlinkSocialAccount(provider) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/unlink/${provider}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
    },
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
