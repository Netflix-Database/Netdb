import { createCreds, isWebAuthnPossible } from '../../../util/webauthn';

export async function createPasskey() {
  if (!isWebAuthnPossible()) {
    console.log('WebAuthn is not supported');
    return;
  }

  await LoginManager.validateToken();
  const optionsReq = await fetch(`https://api.login.${LoginManager.domain}/passkey/options`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
    },
  });

  if (optionsReq.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  const options = await optionsReq.json();
  const creds = await createCreds(options);

  const createReq = await fetch(`https://api.login.${LoginManager.domain}/passkey/createCredentials`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  });

  if (createReq.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }
}
