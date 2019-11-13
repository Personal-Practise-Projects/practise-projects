import {
  ON_FETCH_PRODUCTS,
  ON_FETCH_PRODUCTS_CONFIG,
  EMPTY_PRODUCTS,
  CREATE_PRODUCT,
  ON_UPDATE_PRODUCTS,
} from './types';
import AxiosBuilder from '../common/axiosBuilder';

export const updateProductsData = payload => ({
  type: ON_FETCH_PRODUCTS,
  payload,
});

export const updateProductsMetaInfo = payload => ({
  type: ON_FETCH_PRODUCTS_CONFIG,
  payload,
});

export const resetProductsData = payload => ({
  type: EMPTY_PRODUCTS,
  payload,
});

export const createProduct = (productName, callback) => dispatch => {
  const requestPayload = {
    data: JSON.stringify({
      name: productName,
    }),
  };
  new AxiosBuilder(`/products/`, requestPayload)
    .withAuth()
    .POST()
    .then(response => {
      const product = response.data;

      dispatch({
        type: CREATE_PRODUCT,
        payload: product,
      });

      callback(product);
    });
};

export const updateProduct = payload => ({
  type: ON_UPDATE_PRODUCTS,
  payload,
});
