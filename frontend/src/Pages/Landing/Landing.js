/////////////////////////////////////////////////////////////////////

  //Landing bzw. Startseite

/////////////////////////////////////////////////////////////////////

import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../images/Logo/Logo_ArtBoard2.png';

import "./Landing.scss";

const Landing = () => (
  <div className="Landing">

    <div className="context">
    <div className="Landing_header">

      {/* Logo */}
      <img src={Logo} alt="Logo ArtBoard"  className="Landing_header-logo"/>
    </div>
    <div className="Landing_main">
      <div className="Landing_main-link">
        {/* Link zur Registrierungsseite */}
        <Link
          to="/register"
          className="Landing_main-link-left"
        >
          <button className="button Landing-button">Registerung</button>
        </Link>
      </div>
      <div className="Landing_main-link">
        {/* Link zur Loginseite */}
        <Link
          to="/login"
          className="Landing_main-link-right"
        >
          <button className="button Landing-button">Einloggen</button>
        </Link>
      </div>
    </div>
    </div>

    {/* durch die Gegend fliegende Rechtecke */}
    <div className="area" >
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    </div >
    </div>
);

export default Landing;