export async function deleteDevice(id) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user/device/${id}`, {
    method: 'DELETE',
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
