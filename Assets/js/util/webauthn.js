export function isWebAuthnPossible() {
  return !!window.PublicKeyCredential;
}

function toBase64Url(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=*$/g, '');
}

function fromBase64Url(value) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
}

function base64StringToUrl(base64String) {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/g, '');
}

export async function createCreds(options) {
  if (typeof options.challenge === 'string') options.challenge = fromBase64Url(options.challenge);
  if (typeof options.user.id === 'string') options.user.id = fromBase64Url(options.user.id);
  if (options.rp.id === null) options.rp.id = undefined;
  for (const cred of options.excludeCredentials) {
    if (typeof cred.id === 'string') cred.id = fromBase64Url(cred.id);
  }
  const newCreds = await navigator.credentials.create({ publicKey: options });
  const { response } = newCreds;
  const retval = {
    id: base64StringToUrl(newCreds.id),
    rawId: toBase64Url(newCreds.rawId),
    type: newCreds.type,
    clientExtensionResults: newCreds.getClientExtensionResults(),
    response: {
      attestationObject: toBase64Url(response.attestationObject),
      clientDataJSON: toBase64Url(response.clientDataJSON),
      transports: response.getTransports ? response.getTransports() : [],
    },
  };
  return retval;
}

export async function verify(options) {
  if (typeof options.challenge === 'string') options.challenge = fromBase64Url(options.challenge);
  if (options.allowCredentials) {
    for (let i = 0; i < options.allowCredentials.length; i++) {
      const { id } = options.allowCredentials[i];
      if (typeof id === 'string') options.allowCredentials[i].id = fromBase64Url(id);
    }
  }
  const creds = await navigator.credentials.get({ publicKey: options });
  const { response } = creds;
  const retval = {
    id: creds.id,
    rawId: toBase64Url(creds.rawId),
    type: creds.type,
    clientExtensionResults: creds.getClientExtensionResults(),
    response: {
      authenticatorData: toBase64Url(response.authenticatorData),
      clientDataJSON: toBase64Url(response.clientDataJSON),
      userHandle: response.userHandle && response.userHandle.byteLength > 0 ? toBase64Url(response.userHandle) : undefined,
      signature: toBase64Url(response.signature),
    },
  };
  return retval;
}
