import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.scss';
import './main.scss';

import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import store from '../store';

import setAuthToken from '../core/utils/setAuthToken';
import { setCurrentUser, logoutUser } from '../core/actions/authActions';

import PrivateRoute from '../components/PrivateRoutes';

import Home from '../Pages/Home/Home';
import Upload from '../Pages/Upload/Upload';
import Profil from '../Pages/Profil/Profil';
import Landing from '../Pages/Landing/Landing';
import Register from '../Pages/Register/Register';
import Login from '../Pages/Login/Login';
import Kollektion from '../Pages/Kollektion/Kollektion';
import DetailImage from '../Pages/DetailImage/DetailImage';
import DetailKollektion from '../Pages/DetailKollektion/DetailKollektion';

//Wenn JWT token existiert, soll ein neuer Token erstellt werden
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);

  const decoded = jwtDecode(token);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = './login';
  }
}

const App = () => (
  <Provider store={store}>
    <Router>
      <main className="main">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/upload" component={Upload} />
          <PrivateRoute exact path="/profil/:_id" component={Profil} />
          <PrivateRoute exact path="/kollektion" component={Kollektion} />
          <PrivateRoute exact path="/detailimage/:_imageid" component={DetailImage} />
          <PrivateRoute exact path="/detailkollektion/:_kollektionid" component={DetailKollektion} />

        </Switch>
      </main>
    </Router>
  </Provider>
);

export default App;