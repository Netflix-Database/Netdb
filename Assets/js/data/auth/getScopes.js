export async function getScopes() {
  const req = await fetch(`${LoginManager.apiUrl}/scopes`, {
    method: 'GET',
  });

  return req;
}
