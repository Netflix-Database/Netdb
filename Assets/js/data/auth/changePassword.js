export async function changePassword(oldPw, email, pw, mfaToken) {
  await LoginManager.validateToken();
  const req = await fetch(`https://api.login.${LoginManager.domain}/resetpassword`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + LoginManager.getCookie('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      OldPassword: oldPw,
      Email: email,
      Password: pw,
      TwoFaToken: mfaToken,
    }),
  });

  if (req.status == 401) {
    window.location.href = LoginManager.buildLoginUrl(window.location.href);
    return;
  }

  return req;
}