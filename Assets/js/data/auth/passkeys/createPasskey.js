import { createCreds, isWebAuthnPossible } from '../../../util/webauthn';

export async function createPasskey() {
  if (!isWebAuthnPossible()) {
    console.warn('WebAuthn is not supported');
    return;
  }

  await LoginManager.validateToken();
  const optionsReq = await fetch(`${LoginManager.apiUrl}/passkey/options`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
    },
  });

  if (optionsReq.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  const options = await optionsReq.json();
  const creds = await createCreds(options);

  const createReq = await fetch(`${LoginManager.apiUrl}/passkey/createCredentials`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LoginManager.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  });

  if (createReq.status === 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }
}
