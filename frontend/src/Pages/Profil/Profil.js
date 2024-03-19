/////////////////////////////////////////////////////////////////////

  //Profil

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Profil.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../../components/Header';
import Posts from '../../components/Post';

import { connect } from 'react-redux';

const Profil = ({ auth }) => {

  const [didMount, setDidMount] = useState(false);
  const [scroll, setScroll] = useState(false);

  //Speichern von Kollektionen
  const [collections, setCollections] = useState([]);

  //Konstante, welche Unterseite ausgewählt ist
  const [page, setPage] = useState("post");

  //Speichern der Bilder
  const [files, setFiles] = useState([]);

  //Aus Url den Profilnamen nehmen
  const url = window.location.pathname.split('/');
  const userId = url[url.length - 1];
  const linkUser = userId.split('_').join(' ');

  useEffect(() => {
    const filter = {
      searchTerm: linkUser,
    };
    setPage("post");

    getImage(filter);


    window.addEventListener("scroll", () => {
        setScroll(window.scrollY > 180);
    });

    setDidMount(true);
    return () => setDidMount(false);
  }, [linkUser]);

  //Abrufen der Bilder, die zum Nutzer gehören
  const getImage = (filter) => {
    axios.post('http://localhost:5000/api/uploads/getImageProfil', filter)
      .then((res) => {
        if (res.data.success) {
          setFiles(res.data.Uploads);
        }
      })
      .catch(() => {
      });
  };

  //Abrufen der Kollektionen
  const getCollection = (filter) => {
    axios.post('http://localhost:5000/api/imagecollections/getCollection', filter)
      .then((res) => {
        if (res.data.success) {
          setCollections(res.data.collections);
        }
      })
      .catch(() => {
      });
  };

  //Wechsel zur Unterseite Post
  const changetopost = () => {
    setPage("post");
  }

  //Wechseln der Unterseite Kollektion
  const changetocollectionpage = () => {
    const filter = {
      searchTerm: linkUser,
    };

    setPage("collection");
    getCollection(filter);
  }


  const renderCollections = collections.map((collection, collectionindex) => {

    return(
      <div className="profil_main-collection" key={collectionindex}>
        <h3 className="profil_main-header">{collection.collectionname}</h3>
        <div className="profil_main-collection-main">

          {files.map((file, index) =>{

            //Aufrufen der einzelnen Posts die zu einer Kollektion gehören
            if(collection.collectionimages[0][index] === file._id ){
              return(  
                <div key={index} className="profil_main-collection-main-images">     
                  <Link to={`/detailkollektion/${collection._id} `}>
                  <img 
                    src={`/../${file.filepath}`} 
                    alt={collection.collectionname} 
                    className="profil_main-collection-main-image"
                  />
                  </Link>
                </div>
              )
            }else{
              return(
                <div className="none" key={index} />
              )
            }

          })}

        </div>

      
      </div>
    )
  });

  return(
    <div className="profil">
        <Header />

        {/* Profilname und Bild */}
        <div className="profil_header">
            <FontAwesomeIcon icon={["fas", "user-circle"]}  className="profil_header-icon"/>
            <h2 className="profil_header-h2">
                {linkUser}
            </h2>
        </div>
 
        {/* Profiluntermenü */}
        <div className={scroll ? "profil_menu profil_menu-scroll" : "profil_menu"}>
          <div className={"profil_menu-postpage"}>
            <button className={page=== "post" ? "profil_menu-postpage-button active" : "profil_menu-postpage-button"} onClick={changetopost}>
                Posts
            </button>
          </div>
          <div className={"profil_menu-collectionpage"}>
            <button className={page=== "collection" ? "profil_menu-collectionpage-button active" : "profil_menu-collectionpage-button"} onClick={changetocollectionpage}>
                Kollektionen
            </button>
          </div>
        </div>
          
        {/* Inhalt Postsunterseite */}
        { page === "post" ? 
            <div>
                {files.length != 0 ?
                  <div className="profil_main">
                    <Posts search={linkUser} classes="profil_main" styleclass="post-stylemain"/>
                  </div>
                : 
                  <div className="profil_nopost">
                    {/* wenn keine Posts vorhanden sind */}
                    <FontAwesomeIcon icon={["fas", "eye-slash"]}  className="profil_nopost-icon"/>
                    <h3>Sie haben noch keine Bilder hochgeladen</h3>
                  </div>
                }
            </div>
        : null}

        {/* Inhalt Kollektionsunterseite */}
        { page === "collection" ? 

            <div className="profil_main">

              {renderCollections}

              {/* neue Kollektion erstellen */}
              {linkUser === auth.user.name ?
              <div className="profil_main">
              {files.length != 0 ?
                <div className="profil_main-collection">
                  <h3 className="profil_main-header">Neu</h3>
                  <Link to="/kollektion" className="profil_main-link">
                    <FontAwesomeIcon icon={["fas", "plus"]}  className="profil_main-link-icon"/>
                  </Link>
                </div>
              : 
              <div className="profil_nopost profil_nopost-kollektion">
                  {/* wenn keine Posts vorhanden sind */}
                  <FontAwesomeIcon icon={["fas", "eye-slash"]}  className="profil_nopost-icon"/>
                  <h3>Sie haben noch keine Bilder hochgeladen</h3>
              </div>
              }
              </div> : null}

            </div>
        : null}
        
    </div>
  )
};

Profil.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profil);