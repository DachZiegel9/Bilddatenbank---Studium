/////////////////////////////////////////////////////////////////////

  //Authentifikationstoken erstellen oder löschen

/////////////////////////////////////////////////////////////////////

import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // Autorisierungstoken auf jede Anfrage anwenden, wenn angemeldet
    axios.defaults.headers.common.Authorization = token;
  } else {
    // Löschen des Auth Headers
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;