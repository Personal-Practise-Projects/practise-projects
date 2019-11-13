import { StringHelper } from './utils';

export function getParamForKeyFromUrl(key, defaultValue = null) {
  const params = new URL(document.location).searchParams;
  return params.get(key) || defaultValue;
}

export function getBrandRedirectionPath(brand) {
  return {
    title: brand.brand_name,
    link: StringHelper.format('brands?redirected=true&brand=##', brand.id),
  };
}
