/////////////////////////////////////////////////////////////////////

  //Register

/////////////////////////////////////////////////////////////////////

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { registerUser } from '../../core/actions/authActions';

import './Register.scss';

const Register = ({ registerUser, auth, errors }) => {

  //Speicherung der einzelnen Eingabewerte für Login
  const [registerData, setregisterData] = React.useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  });

  //Konstante - wenn Registrierung erfolgreich war
  const [registerAccept, setregisterAccept] = React.useState(false);

  //Änderung in den Eingabefeldern
  const onChange = (e) => {
    setregisterData({ ...registerData, [e.target.id]: e.target.value });
  };

  //Senden die Registrierungswerte
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      password2: registerData.password2,
    };

    registerUser(newUser, setregisterAccept);

    registerData.name = '';
    registerData.email = '';
    registerData.password = '';
    registerData.password2 = '';
    registerData.errors = {};
  };

  return (
    <div className="register">
      <div className="mainheader">
        <h2 className="mainheader-text">Registrierung</h2>
      </div>

      {/* Zurück */}
      <div className="back">
        <Link to="/" className="back-link">
          <FontAwesomeIcon icon={["fas", "long-arrow-alt-left"]} />
          Wieder zurück zum Start
        </Link>
      </div>

      <div className="register_main">

        {/* Bestätigungstext, wenn die Registrierung erfolgreich war */}
        {registerAccept== true ?
          <div className="accept">
            <p className="accept-text">
              Sie haben sich erfolgreich registriert
            </p>
          </div>
        : null}

        <form noValidate onSubmit={handleSubmit} className="register_main-col">
          <div className="register_main-col">
            <label htmlFor="name" className="register_main-col-label">
              Benutzername:
              <span className="red">*</span>
              <span className="message">{errors.name}</span>
            </label>

            {/* Benutzer Eingabefeld */}
            <input
              onChange={onChange}
              value={registerData.name}
              error={errors.name}
              id="name"
              type="text"
              className="inputfield"
            />
          </div>
          <div className="register_main-col">
            <label htmlFor="email" className="register_main-col-label">
              Email:
              <span className="red">*</span>
              <span className="message">{errors.email}</span>
              
            </label>

            {/* E-Mail Eingabefeld */}
            <input
              onChange={onChange}
              value={registerData.email}
              error={errors.email}
              id="email"
              type="email"
              className="inputfield"
            />
          </div>
          <div className="register_main-col">
            <label htmlFor="password" className="register_main-col-label">
              Passwort: 
              <span className="note">(min. 6 Zeichen)</span>
              <span className="red">*</span>
              <span className="message">{errors.password}</span>
            </label>

            {/* Passwort Eingabefeld */}
            <input
              onChange={onChange}
              value={registerData.password}
              error={errors.password}
              id="password"
              type="password"
              className="inputfield"
            />
          </div>
          <div className="register_main-col">
            <label htmlFor="password2" className="register_main-col-label">
              Passwort bestätigen:
              <span className="red">*</span>
              <span className="message">{errors.password2}</span>
            </label>

            {/* Passwort bestätigen Eingabefeld */}
            <input
              onChange={onChange}
              value={registerData.password2}
              error={errors.password2}
              id="password2"
              type="password"
              className="inputfield"
            />
          </div>

          {/* Verweis zu Login */}
          <div className="register_main-log">
            <p>
              Besitzen Sie bereits einen Account?
              {' '}
              <Link 
                to="/login" 
                className="register_main-log-link"
              >
                Hier einloggen
              </Link>
            </p>
          </div>

          <div className="register_main-2col">
            {/* Loginbutton */}
            <button
              type="submit"
              className="button"
            >
              Registierung
            </button>
          </div>
          <div className="register_main-2col">
            {/* Abbrechenbutton -> zurück zu Landing */}
            <Link 
              to="/" 
              className="register_main-2col-link"
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { registerUser },
)(withRouter(Register));