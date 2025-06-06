export async function deleteDevice(id) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/user/device/${id}`, {
    method: 'DELETE',
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
