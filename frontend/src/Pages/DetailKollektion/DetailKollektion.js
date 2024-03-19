/////////////////////////////////////////////////////////////////////

  //Aufrufen einer einzelnen Kollektion

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './DetailKollektion.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../../components/Header';
import Posts from '../../components/Post';

import { connect } from 'react-redux';

const DetailKollektion = ({ auth }) => {

  const [didMount, setDidMount] = useState(false); 

  //speicherung der Kollektion
  const [collections, setCollections] = useState([]);

  ////speicherung der Bilder
  const [files, setFiles] = useState([]);

  //Aus Url die Id der Kollektion nehmen
  const url = window.location.pathname.split('/');
  const kollektId = url[url.length - 1];
  const linkKollekt = kollektId.split('_').join(' ');

  useEffect(() => {
    const filter = {
      searchTerm: linkKollekt,
    };

    getCollection(filter);
    setDidMount(true);
    return () => setDidMount(false);
  }, [linkKollekt]);

  //Abrufen der Bilder
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

  //Abrufen der Kollektion
  const getCollection = (filter) => {
    axios.post('http://localhost:5000/api/imagecollections/getCollectionDetail', filter)
      .then((res) => {
        if (res.data.success) {
          setCollections(res.data.collections);
        }
      })
      .catch(() => {
      });
  };

  const renderCollections = collections.map((collection, collectionindex) => {

    //falls der Benutzername aus mehreren Wörtern besteht, wandelt der die Leerzeichen zu Unterstrichen um, damit die URLs zum Profil keine Leerzeichen haben
    const linkUser = collection.collectionuser.split(' ').join('_');

    getImage(collection.collectionuser);

    return(
      <div className="kollektion" key={collectionindex}>

        {/* Kollektionsname */}
        <div className="mainheader">
            <h1 className="mainheader-text">
                {collection.collectionname}
            </h1>
        </div>

        {/* zurück */}
        <div className="back">
            <Link to={`/profil/${linkUser}`} className="back-link">
                <FontAwesomeIcon icon={["fas", "long-arrow-alt-left"]} />
                {' '}
                Wieder zurück zum Start
            </Link>
        </div>

        {files.map((file, index) =>{

          	//Aufrufen der einzelnen Posts die zu einer Kollektion gehören
            if(collection.collectionimages[0][index] === file._id ){
              return(  
                <div key={index} className="">     
                    <Posts search={file._id} searchId={true} styleclass="post-image-full"/>
                </div>
              )
            }else{
              return(
                <div key={index} className="none" />
              )
            }

          })}
      
      </div>
    )
  });

  return(
    <div className="detailkollektion">
        <Header />
        {renderCollections}
    </div>
  )
};

DetailKollektion.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DetailKollektion);