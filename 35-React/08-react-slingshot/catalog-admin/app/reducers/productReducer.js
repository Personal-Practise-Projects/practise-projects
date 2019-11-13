import {
  CREATE_PRODUCT,
  EMPTY_PRODUCTS,
  ON_FETCH_PRODUCTS,
  ON_FETCH_PRODUCTS_CONFIG,
  ON_UPDATE_PRODUCTS,
} from '../actions/types';

export const PRODUCT_DEFAULT_STATE = {
  meta_info: {
    detail_header: [],
    list_header: [],
  },
  products: [],
  productDict: {},
};

export function productReducer(state = PRODUCT_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case ON_FETCH_PRODUCTS: {
      const productDict = { ...state.productDict };
      payload.map(product => {
        productDict[product.id] = product;
      });
      state.products.push(...payload);
      return {
        ...state,
        productDict,
      };
    }
    case CREATE_PRODUCT: {
      const products = state.products.slice();
      products.unshift(payload);
      state.products = products;
      const productDict = Object.assign({}, state.productDict);
      productDict[payload.id] = payload;
      return {
        ...state,
        productDict,
      };
    }
    case EMPTY_PRODUCTS: {
      return {
        ...state,
        products: [],
        productDict: {},
      };
    }
    case ON_FETCH_PRODUCTS_CONFIG: {
      return {
        ...state,
        meta_info: payload,
      };
    }
    case ON_UPDATE_PRODUCTS: {
      state.products = state.products.map(
        product => (payload.id === product.id ? payload : product),
      );
      state.productDict[payload.id] = payload;
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
