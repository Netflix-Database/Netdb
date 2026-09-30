export async function saveUser(firstname, lastname, country, preferredLang, username) {
  await LoginManager.validateToken();
  const req = await fetch(`${LoginManager.apiUrl}/user`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${  LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname: firstname,
      lastname: lastname,
      country: country,
      preferredLang: preferredLang,
      username: username,
    }),
  });

  if (req.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}
