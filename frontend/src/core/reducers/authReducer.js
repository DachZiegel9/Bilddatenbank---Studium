/////////////////////////////////////////////////////////////////////

  //Authentifikations Reducer (Redux)

/////////////////////////////////////////////////////////////////////

import {
    USER_LOADING,
    SET_CURRENT_USER,
  } from '../actions/types';
  
  const isEmpty = require('is-empty');
  
  const initialState = {
    isAuthenticated: null,
    user: {},
    loading: false,
  };
  
  export default function user(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true,
        };
      default:
        return state;
    }
  }