/////////////////////////////////////////////////////////////////////

  //Store

/////////////////////////////////////////////////////////////////////

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './core/reducers';

const initialState = {};

const middleWare = [thunk];

//Erstellt einen vollästndigen Statusbaum der App
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleWare),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) || compose,
  ),
);

export default store;