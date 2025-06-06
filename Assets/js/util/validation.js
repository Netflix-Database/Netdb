export function isUpperCase(str) {
  return /[A-Z]/.test(str);
}

export function isLowerCase(str) {
  return /[a-z]/.test(str);
}

export function isNumber(str) {
  return /[0-9]/.test(str);
}

export function validatePw(oldPw, pw, rpw) {
  if (pw === null || rpw === null) return 'Please fill out all fields';

  if (pw.length < 8) return 'The password has to be at least 8 characters long';

  if (!isUpperCase(pw)) return 'The password has to contain at least one uppercase letter';

  if (!isLowerCase(pw)) return 'The password has to contain at least one lowercase letter';

  if (!isNumber(pw)) return 'The password has to contain at least one number';

  if (pw !== rpw) return 'Passwords do not match';

  if (pw === oldPw) return 'The new password cannot be the same as the old one';
}

export function validateMfaToken(token) {
  if (token.length !== 6) return false;
  if (!isNumber(token)) return false;

  return true;
}
