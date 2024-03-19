/////////////////////////////////////////////////////////////////////

  //Aufrufen von Weiterleitungen & Funktionen zu Registrierung, Login & Logout

/////////////////////////////////////////////////////////////////////

import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import {
  GET_ERRORS,
  USER_LOADING,
  SET_CURRENT_USER,
} from './types';

// Registrierung des User
export const registerUser = (userData, setregisterAccept) => (dispatch) => {
  axios
    .post('/API/users/register', userData)
    .then((res) => setregisterAccept(true))
    .catch((err) => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
};

// Angemeldeten User einstellen
export const setCurrentUser = (decode) => ({
  type: SET_CURRENT_USER,
  payload: decode,
});

// Login des Users & Erhalten der Benutzertoken
export const loginUser = (userData) => (dispatch) => {
  axios
    .post('/API/users/login', userData)
    .then((res) => {
      // in localStorage speichern
      // Token auf localStorage setzen
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);

      // Token auf Auth Header setzen
      setAuthToken();

      // Token decodieren, um Userdaten zu erhalten
      const decode = jwtDecode(token);

      // Aktuellen User einstellen
      dispatch(setCurrentUser(decode));
    })
    .catch((err) => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
};

// User laden
export const setUserLoading = () => ({
  type: USER_LOADING,
});

// Ausloggen des Users
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};