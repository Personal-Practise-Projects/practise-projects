import {
  CREATE_BRAND,
  FETCH_BRAND,
  FETCH_BRAND_CONFIG,
  RESET_BRAND,
  UPDATE_BRAND,
} from '../actions/types';

export const BRAND_DEFAULT_STATE = { metaInfo: {}, brands: [], brandsDict: {} };

export function brandReducer(state = BRAND_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case CREATE_BRAND: {
      let brands = state.brands.slice();
      brands.unshift(payload);
      state.brands = brands;
      state.brandsDict[payload.id] = payload;
      return { ...state };
    }
    case UPDATE_BRAND: {
      state.brands = state.brands.map(brand => {
        if (payload.id === brand.id) {
          return payload;
        }
        return brand;
      });
      state.brandsDict[payload.id] = payload;
      return { ...state };
    }
    case FETCH_BRAND_CONFIG:
      state.metaInfo = payload;
      return { ...state };
    case FETCH_BRAND:
      state.brands = [...state.brands, ...payload];
      state.brandsDict = { ...state.brandsDict };
      payload.map(brand => {
        state.brandsDict[brand.id] = brand;
      });
      return { ...state };
    case RESET_BRAND:
      return { ...state, brands: [], brandsDict: {} };
    default:
      return state;
  }
}
