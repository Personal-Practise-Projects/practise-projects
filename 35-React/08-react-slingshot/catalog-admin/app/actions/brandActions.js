import AxiosBuilder from '../common/axiosBuilder';
import { BRAND_META_INFO, BRAND_UPDATE_DETAIL, DONE, FAILED, LIST_CREATE_BRAND, } from '../common/constants';
import {
  CREATE_BRAND,
  CREATE_BRAND_FAILED,
  FETCH_BRAND_CONFIG,
  FETCH_BRAND_CONFIG_FAILED,
  UPDATE_BRAND,
  UPDATE_BRAND_FAILED,
  RESET_BRAND,
} from './types';

export const fetchBrands = (type, data) => dispatch => {
  dispatch({
    type: type,
    payload: data,
  });
};

export const resetBrandData = () => ({
  type: RESET_BRAND,
  undefined,
});

export const fetchBrandConfig = () => dispatch => {
  new AxiosBuilder(BRAND_META_INFO)
    .withAuth()
    .fetch()
    .then(metaInfoRes => {
      dispatch({
        type: FETCH_BRAND_CONFIG,
        payload: metaInfoRes.data,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_BRAND_CONFIG_FAILED,
        payload: error,
      });
    });
};

export const createBrands = (brand_name, callback) => dispatch => {
  const config = {
    data: JSON.stringify({ name: brand_name }),
  };
  new AxiosBuilder(LIST_CREATE_BRAND, config)
    .withAuth()
    .POST()
    .then(response => {
      let brand = response.data;
      // pass event to called
      callback(CREATE_BRAND, brand);
      // Pass event to reducer
      dispatch({
        type: CREATE_BRAND,
        payload: brand,
      });
    })
    .catch(error => {
      callback(CREATE_BRAND_FAILED, error);
    });
};

export const updateBrands = (brand_id, updateData, callback) => dispatch => {
  const config = {
    data: JSON.stringify(updateData),
  };
  new AxiosBuilder(`${BRAND_UPDATE_DETAIL}${brand_id}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      let brand = response.data;
      callback(DONE, brand);
      // Pass event to reducer
      dispatch({
        type: UPDATE_BRAND,
        payload: brand,
      });
    })
    .catch(error => {
      callback(FAILED, error.response.data);
      dispatch({
        type: UPDATE_BRAND_FAILED,
        payload: error,
      });
    });
};
