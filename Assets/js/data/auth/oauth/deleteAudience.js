export async function deleteAudience(clientId, audienceId) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/oauth/audiences`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${LoginManager.getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId,
      audienceId: audienceId,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
