/** *
 * File keeping configuration based on environment for the project.
 * @type {NodeJS.ProcessEnv}
 */
const DEV = {
  API_ROOT_URL: 'http://localhost:8000/',
  ROOT_URL: 'http://localhost:3000/',
  DJANGO_ROOT_URL: 'http://localhost:8000/admin/',
  BUCKET_URL: 'http://localhost:8000',
};
const STAG = {
  API_ROOT_URL: 'https://api-staging.catalog.cc/',
  ROOT_URL: 'https://admin-staging.catalog.cc/',
  DJANGO_ROOT_URL: 'https://api-staging.catalog.cc/admin/',
  INSPECTLET_KEY: 249101392,
  BUCKET_URL: 'https://staging-catalog.s3.amazonaws.com',
};
const PROD = {
  API_ROOT_URL: 'https://api.catalog.cc/',
  ROOT_URL: 'https://admin.catalog.cc/',
  DJANGO_ROOT_URL: 'https://api.catalog.cc/admin/',
  INSPECTLET_KEY: 249101392,
  BUCKET_URL: 'https://voldemort-prod-catalog.s3.amazonaws.com',
};
// TODO: Add TEST env
const DEFAULT = DEV;

const CONFIGS = {
  production: PROD,
  staging: STAG,
  development: DEV,
};
const ENV = process.env.APP_ENV;
const config = CONFIGS[ENV] || DEFAULT;
config.ENV = ENV;
config.LOCAL_ENV = ['test', 'development'].includes(ENV);
config.REMOTE_ENV = !config.LOCAL_ENV;
config.BUGSNAG_CLIENT_TOKEN = '3f967feccae1c2103d14cb05ffb66cd2';

export default { ...config };
