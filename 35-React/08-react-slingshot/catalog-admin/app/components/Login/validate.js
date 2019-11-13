export function validatePayload(payload) {
  let isValid = true;
  let email = '';
  let password = '';
  if (!payload.email) {
    email = 'has-error';
    isValid = false;
  }
  if (!payload.password) {
    password = 'has-error';
    isValid = false;
  }
  this.setLocalState({ emailError: email, passwordError: password });
  return isValid;
}
