import { persistUserConfig } from '../../helpers/user';

export function updateLocalStorage(response) {
  localStorage.setItem('token', response.token);
  const userInfo = JSON.stringify(response.user);
  localStorage.setItem('user', userInfo);
  localStorage.setItem('tenantId', response.user.tenant_id);
  localStorage.setItem('defaultTenantId', response.user.tenant_id);
  persistUserConfig(response);
}

export function getStyles() {
  return {
    margin: '0 auto',
    width: '30px',
    height: '24px',
  };
}
