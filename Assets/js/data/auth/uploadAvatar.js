export async function uploadAvatar(file) {
  await LoginManager.validateToken();

  const formData = new FormData();
  formData.append('avatar', file);

  const req = await fetch(`${LoginManager.apiUrl}/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
    },
    body: formData,
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
