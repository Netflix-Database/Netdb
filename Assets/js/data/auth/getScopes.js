export async function getScopes() {
  const req = await fetch(`https://api.login.${LoginManager.domain}/scopes`, {
    method: 'GET',
  });

  return req;
}
