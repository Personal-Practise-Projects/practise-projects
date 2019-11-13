import { ADD_CART_ITEM, REMOVE_CART_ITEM } from '../actions/types';

export const CART_DEFAULT_STATE = {
  data: [],
  count: 0,
};

export function cartReducer(state = CART_DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case ADD_CART_ITEM:
      // this payload is the parameter that will be stored to the data
      state.data.unshift(payload);
      state.count += 1;
      return { ...state };

    case REMOVE_CART_ITEM:
      // this payload is the parameter that will be stored to the data
      // check whether the payload/item is in the cart and remove that item
      for (let i = 0; i < state.data.length; i += 1) {
        if (state.data[i] === payload) {
          state.data.splice(i, 1);
        }
      }
      state.count -= 1;
      return { ...state };

    default:
      return state;
  }
}
