import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { INITIAL_STATE } from './reducers';
import config from './config/appConfig';

const middleware = [thunk];
let store;
if (config.ENV === 'development') {
  store = createStore(
    rootReducer,
    INITIAL_STATE,
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
        : f => f,
    ),
  );
} else {
  store = createStore(
    rootReducer,
    INITIAL_STATE,
    compose(applyMiddleware(...middleware)),
  );
}

export default store;
