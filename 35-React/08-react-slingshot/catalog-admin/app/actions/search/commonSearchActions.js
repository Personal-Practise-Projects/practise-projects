import AxiosBuilder from '../../common/axiosBuilder';
import {
  BRAND_LIST,
  BUSINESS_USER_LIST,
  CATEGORY_LIST,
  LOCATIONS_API_ENDPOINT,
  PRODUCT_LIST_API_ENDPOINT,
  PROP_LIST_END_POINT,
  TENANT_USER_ENDPOINT,
  TENANTS,
} from '../../common/constants';
import { getCollaboratorsSearch } from "../../components/ShotDetailsView/services/collaborators";
import { addProduct } from '../../helpers/common';
import { SEARCH_KEYS } from './constants';
import { parseCategory } from '../../helpers/content_request';
import BaseSearchHelper from './base';
import { usersListParser } from "./helpers";

export class ProductSearch {
  constructor(brandId) {
    this.brandId = brandId;
  }

  search(searchString, excludeFromList, callback) {
    const params = {
      search: searchString,
    };
    new AxiosBuilder(
      `${PRODUCT_LIST_API_ENDPOINT}?brd=${this.brandId}&page_size=100`,
    )
      .withParams(params)
      .fetch()
      .then(response => {
        if (response.data.results.length) {
          const parsedData = [];
          response.data.results.map(product => {
            parsedData.push({
              id: product.id,
              name: product.name,
            });
          });
          callback(searchString, parsedData);
        } else {
          callback(searchString, []);
        }
      });
  }

  create = (option, callback) => {
    addProduct(option.name, this.brandId, product => {
      callback({
        id: product.id,
        name: product.name,
      });
    });
  };
}

export function PropSearch() {
  return new BaseSearchHelper(
    PROP_LIST_END_POINT,
    __propsParser,
    ['name'],
    SEARCH_KEYS.PROP,
    { page_size: 100 },
    true,
    false,
    false,
  );
}

export function CategorySearch() {
  return new BaseSearchHelper(
    CATEGORY_LIST,
    __categoryParser,
    ['name'],
    SEARCH_KEYS.CATEGORY,
    { page_size: 100 },
    true,
    false,
    false,
  );
}

export function StaffUsersList() {
  return new BaseSearchHelper(
    BUSINESS_USER_LIST,
    usersListParser,
    ['name', 'email'],
    SEARCH_KEYS.STAFF_USERS,
    { page_size: 100 },
    true,
    false,
    false,
  );
}

export function ProducersList() {
  return getCollaboratorsSearch('PRODUCER');
}

export function LocationSearch() {
  return new BaseSearchHelper(
    LOCATIONS_API_ENDPOINT,
    response => response.data.results,
    ['name'],
    SEARCH_KEYS.LOCATIONS,
    { page_size: 100 },
  );
}

export function ShotCategorySearch() {
  return new BaseSearchHelper(
    'content-category/image/',
    response => response.data.map(category => parseCategory(category)),
    ['name'],
    SEARCH_KEYS.SHOT_CATEGORY,
    {},
  );
}

export function getBrandSearch() {
  return new BaseSearchHelper(
    BRAND_LIST,
    __brandResponseParser,
    ['name'],
    SEARCH_KEYS.BRAND,
    { page_size: 100 },
    true,
    false,
    false,
  );
}

export function getTenantSearch() {
  return new BaseSearchHelper(
    TENANTS,
    __tenantResponseParser,
    ['name'],
    SEARCH_KEYS.TENANT,
  );
}

let __categoryParser = function(response) {
  return response.data.results.map(category => {
    category.thumbnail = category.logo_thumbnail;
    delete category.logo_thumbnail;
    return category;
  });
};

function __brandResponseParser(response) {
  const parsedData = [];
  response.data.results.map(brand => {
    parsedData.push({
      id: brand.id,
      name: brand.name,
    });
  });
  return parsedData;
}

function __tenantResponseParser(response) {
  const parsedData = [];
  response.data.map(tenant => {
    parsedData.push({
      id: tenant.id,
      name: tenant.name,
      title: tenant.name,
    });
  });
  return parsedData;
}

export function getBrandAdminSearch(brandId) {
  return new BaseSearchHelper(
    TENANT_USER_ENDPOINT,
    __brandAdminResponseParser,
    undefined,
    undefined,
    { brandId },
    true,
    true,
    true,
    __onEmptyResponse,
  );
}

function __onEmptyResponse(searchString, callback) {
  const parsedData = [
    {
      id: 0,
      name: searchString,
    },
  ];
  callback(searchString, parsedData);
}

function __brandAdminResponseParser(response) {
  const parsedData = [];
  response.data.map(brand_admin => {
    parsedData.push({
      id: brand_admin.id,
      name: `${brand_admin.name || ''} <${brand_admin.email}>`,
    });
  });
  return parsedData;
}

let __propsParser = function(response) {
  return response.data.results.map(prop => ({
    id: prop.id,
    name: prop.name,
  }));
};
