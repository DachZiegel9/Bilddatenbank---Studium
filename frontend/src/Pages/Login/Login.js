/////////////////////////////////////////////////////////////////////

  //Login

/////////////////////////////////////////////////////////////////////

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../core/actions/authActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Login.scss';

const Login = ({ loginUser, auth, errors, history }) => {

  //Speicherung der einzelnen Eingabewerte für Login
  const [loginData, setloginData] = React.useState({
    email: '',
    password: '',
    errors: {},
  });

  //Änderung in den Eingabefeldern
  const onChange = (e) => {
    setloginData({ ...loginData, [e.target.id]: e.target.value });
  };

  //Senden die Loginwerte
  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: loginData.email,
      password: loginData.password,
    };

    loginUser(userData);

    if (auth.isAuthenticated) {
      history.push('/home');
    }
  };

  return (
    <div className="login">
      <div className="mainheader">
        <h2 className="mainheader-text">Login</h2>
      </div>

      {/* Zurück */}
      <div className="back">
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon={["fas", "long-arrow-alt-left"]} />
          Wieder zurück zum Start
        </Link>
      </div>

      <div className="login_main">
          <form noValidate onSubmit={handleSubmit}>
            <div className="login_main-col">

              <label htmlFor="email" className="login_main-col-label">
                Email:
                <span className="red">*</span>
                <span className="message">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </label>

              {/* E-Mail Eingabefeld */}
              <input
                onChange={onChange}
                value={loginData.email}
                error={errors.email}
                id="email"
                type="email"
                className="inputfield"
              />
            </div>
            <div className="login_main-col">
              <label htmlFor="password" className="login_main-col-label">
                Passwort:
                <span className="red">*</span>
                <span className="message">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </label>

              {/* Passwort Eingabefeld */}
              <input
                onChange={onChange}
                value={loginData.password}
                error={errors.password}
                id="password"
                type="password"
                className="inputfield"
              />
            </div>

            {/* Verweis zu Registrierung */}
            <div className="login_main-log">
              <p>
                Noch nicht registriert?
                {' '}
                <Link 
                  to="/register" 
                  className="login_main-log-link"
                >
                  Hier Registierung
                </Link>
              </p>
            </div>

            {/* Loginbutton */}
            <div className="login_main-2col">
              <button
                type="submit"
                className="button"
              >
                Login
              </button>
            </div>

            {/* Abbrechenbutton -> zurück zu Landing */}
            <div className="login_main-2col">
            <Link 
              to="/" 
              className="login_main-2col-link"
            >
              <button className="button">
                Abbruch
              </button>
            </Link>
          </div>
          </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { loginUser },
)(Login);