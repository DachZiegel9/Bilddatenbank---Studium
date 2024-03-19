/////////////////////////////////////////////////////////////////////

  //Header für alle angemeldeten Seiten

/////////////////////////////////////////////////////////////////////

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Header.scss';

import Logo from '../../images/Logo/Logo_ArtBoard2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { logoutUser } from '../../core/actions/authActions';


const Header =  ({ auth, logoutUser }) => {

    //falls der Benutzername aus mehreren Wörtern besteht, wandelt der die Leerzeichen zu Unterstrichen um, damit die URLs zum Profil keine Leerzeichen haben
    const linkUser = auth.user.name.split(' ').join('_');

    return(
        <header className="header">

            {/*Linke Hälfte des Headers mit den Logo*/}
            <div className="header_left">
                <Link className="header_left-link" to="/home">
                    <img src={Logo} alt="Logo ArtBoard"  className="header_logo"/>
                </Link>
            </div>


            {/*Rechte Hälfte des Headers mit den Icons*/}
            <div className="header_right">
                <Link className="header_right-link" to="/home">
                    <FontAwesomeIcon icon={["fas", "home"]}  className="header_icon"/>
                </Link>
                <Link className="header_right-link" to="/upload">
                    <FontAwesomeIcon icon={["fas", "plus-circle"]}  className="header_icon"/>
                </Link>
                <Link className="header_right-link" to={`/profil/${linkUser}`}>
                    <FontAwesomeIcon icon={["fas", "user-circle"]}  className="header_icon"/>
                </Link>
                <button
                    onClick={logoutUser}
                    className="header_right-button"
                    type="button"
                >
                    <FontAwesomeIcon icon={["fas", "sign-out-alt"]}  className="header_icon"/>
                </button>
            </div>
        </header>
    )
};

Header.propTypes = {
    auth: PropTypes.objectOf(PropTypes.any).isRequired,
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});
  
export default connect(
    mapStateToProps,
    { logoutUser },
  )(Header);