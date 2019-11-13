import { ADD_CART_ITEM, REMOVE_CART_ITEM } from './types';

export const addItemToCart = data => dispatch => {
  dispatch({
    type: ADD_CART_ITEM,
    payload: data,
  });
};

export const removeItemFromCart = data => dispatch => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: data,
  });
};
