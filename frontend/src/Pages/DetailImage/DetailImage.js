/////////////////////////////////////////////////////////////////////

  //Aufrufen eines einzelnen Bildes

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './DetailImage.scss';

import Header from '../../components/Header';
import Posts from '../../components/Post';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

const DetailImage = ({ auth }) => {

  const [didMount, setDidMount] = useState(false); 

  //speicherung des Bildes
  const [files, setFiles] = useState([]);

  //Boolean, ob das Bild gelöscht wurde
  const [deletedImage, setDeletedImage] = useState(false);

  //Aus Url die Id des Bildes nehmen
  const url = window.location.pathname.split('/');
  const imageId = url[url.length - 1];

  var linkUser = '';


  useEffect(() => {
    const filter = {
      searchTerm: imageId,
    };

    getImage(filter);


    setDidMount(true);
    return () => setDidMount(false);
  }, [deletedImage]);

  //Abrufen des Bildes
  const getImage = (filter) => {
    axios.post('http://localhost:5000/api/uploads/getImageDetail', filter)
      .then((res) => {
        if (res.data.success) {
          setFiles(res.data.Uploads);
        }
      })
      .catch(() => {
      });
  };

  //Löschen des Bildes
  const deleteImage = () => {

    axios.delete(`http://localhost:5000/api/uploads/deleteImage?path=${files[0].filepath}&id=${imageId}`)             
        .then(setDeletedImage(true))             
        .catch(err => console.log(err))
  }

  const renderImages = files.map((file, index) => {
    linkUser=file.fileuser;
    console.log(linkUser);

    return(
      <div key={index}>
        {/* Löschbutton */}
        { linkUser == auth.user.name ?
          <div className="detailImage_main-delete">
            <button className="button detailImage_main-delete-button" onClick={deleteImage}>
              Löschen
            </button>
          </div>
        : null}
      </div>
    )
  });

  return(
    <div className="detailImage">
      <Header />
      <div className="detailImage_main">

        <div className="back">
          <Link to="/home" className="back-link">
            <FontAwesomeIcon icon={["fas", "long-arrow-alt-left"]} />
            {' '}
            Wieder zurück zum Start
          </Link>
        </div>

        {deletedImage == true ?
          <div className="detailImage_main">
            <div className="accept">
              <p className="accept-text">
                Die Datei wurde gelöscht
              </p>
            </div>
          </div>
        : 
        <div className="home_main">
          <Posts search={imageId} searchId={true} styleclass="post-image-full"/>

          {renderImages}

        </div>
        
        }
      </div>
    </div>
  )
};

DetailImage.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DetailImage);