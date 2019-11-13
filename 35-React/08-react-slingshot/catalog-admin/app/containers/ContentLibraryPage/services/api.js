import AxiosBuilder from '../../../common/axiosBuilder';
import config from '../../../config/appConfig';

// api routes
export const API_BASE = `${config.API_ROOT_URL}api/v1`;
export const BRAND_API = '/brands/';
export const CONTENT_API = '/contents-library/';
export const SHOT_API = '/shots/';
export const CONTENT_REQUESTS = '/content-requests/';
export const CATEGORIES_API = '/categories/';

// getting all the brands
export const getAllBrands = () =>
  new AxiosBuilder(API_BASE + BRAND_API).withAuth().fetch();

// getting all the CRIDs
export const getAllContents = brandId =>
  new AxiosBuilder(API_BASE + BRAND_API + brandId + CONTENT_API)
    .withAuth()
    .fetch();

export const getAllShots = contentId =>
  new AxiosBuilder(API_BASE + SHOT_API + contentId).withAuth().fetch();

export const getAllContentDetails = (brandId, contentId) =>
  new AxiosBuilder(API_BASE + BRAND_API + brandId + CONTENT_API + contentId)
    .withAuth()
    .fetch();

export const getAllCategory = () =>
  new AxiosBuilder(API_BASE + CATEGORIES_API).withAuth().fetch();

export const getContentCount = brandId =>
  new AxiosBuilder(API_BASE + BRAND_API + brandId + CONTENT_REQUESTS)
    .withAuth()
    .fetch();
