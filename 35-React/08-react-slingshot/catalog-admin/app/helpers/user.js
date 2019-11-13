import { loadBasicConfig } from '../actions/commonActions';
import Logger from '../logging/logger';

const logger = Logger.createLogger('UserUtils');
export const USER_CONFIG_STORAGE_KEY = 'userConfigV2';

let currentSelectedTenantId = null;

export const persistUserConfig = response => {
  const userConfig = {};
  userConfig.navMenu = response.navigation;
  userConfig.headersConfig = response.headers;
  userConfig.features = response.features;
  localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(userConfig));
};

export const getHeadersConfig = () => {
  const userConfig =
    JSON.parse(localStorage.getItem(USER_CONFIG_STORAGE_KEY)) || {};
  const headerConfig = userConfig.headersConfig || [];
  if (headerConfig.length <= 0) {
    loadBasicConfig();
  }
  return headerConfig;
};

export function getNavMenu() {
  const userConfig =
    JSON.parse(localStorage.getItem(USER_CONFIG_STORAGE_KEY)) || {};
  const navConfig = userConfig.navMenu || [];
  if (navConfig.length <= 0) {
    loadBasicConfig();
  }
  return navConfig;
}

export function getDefaultMenu() {
  const navConfig = getNavMenu();
  if (navConfig.length > 0) {
    return navConfig[0];
  }
  return null;
}

export const updateSelectedTenantId = value => {
  localStorage.setItem('tenantId', value);
  currentSelectedTenantId = value;
};

export function getCurrentSelectedTenant() {
  if (currentSelectedTenantId) {
    return currentSelectedTenantId;
  }
  let storedTenantId = localStorage.getItem('tenantId');
  if (!storedTenantId) {
    localStorage.setItem(
      'tenantId',
      JSON.parse(localStorage.getItem('user')).tenant_id,
    );
    storedTenantId = localStorage.getItem('tenantId');
  }
  try {
    currentSelectedTenantId = parseInt(storedTenantId, 10);
  } catch (e) {
    logger.log('tenant id parse issue', e);
  }
  return currentSelectedTenantId;
}

export function getDefaultTenant() {
  let tenantId;
  let storedTenantId = localStorage.getItem('defaultTenantId');
  if (!storedTenantId) {
    localStorage.setItem(
      'defaultTenantId',
      JSON.parse(localStorage.getItem('user')).tenant_id,
    );
    storedTenantId = localStorage.getItem('defaultTenantId');
  }
  try {
    tenantId = parseInt(storedTenantId, 10);
  } catch (e) {
    logger.log('tenant id parse issue', e);
  }
  return tenantId;
}
