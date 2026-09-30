export async function deleteAudience(clientId, audienceId) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/oauth/audiences`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
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
