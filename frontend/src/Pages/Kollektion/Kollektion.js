/////////////////////////////////////////////////////////////////////

  //Kollektion erstellen

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Kollektion.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../../components/Header';

import { connect } from 'react-redux';

const Kollektion = ({ auth }) => {

    const [didMount, setDidMount] = useState(false); 

    //Speichern der Bilder
    const [files, setFiles] = useState([]);

    //Speichern der ausgewählten Bilder
    const [collection, setCollection] = useState([]);

    //Konstante - Beim auswählen des Bildes wird ein Haken über das Bild gesetzt
    const [checkImage, setCheckImage] = useState([]);

    //Speichern des Kollektionsnamens
    const [kollektionName, setKollektionName] = useState('');

    //Konstante - wenn Upload erfolgreich war
    const [uploadAccept, setUploadAccept] = useState(false);

    useEffect(() => {
        const filter = {
            searchTerm: auth.user.name,
        };

        getImage(filter);

        setDidMount(true);
        return () => setDidMount(false);
    }, []);

    //Abrufen der Bilder, die zum Nutzer gehören
    const getImage = (filter) => {
        axios.post('http://localhost:5000/api/uploads/getImageProfil', filter)
        .then((res) => {
            if (res.data.success) {
                setFiles(res.data.Uploads);
                console.log(res.data.Uploads);
            }
        })
        .catch(() => {
        });
    };

    //Änderung des Kollektionsnamen
    const onChangeKollektionName = (event) => {
        setKollektionName(event.target.value);
        console.log(event.target.value);
    };

    //Speichern der Kollektion auf der DB
    const sendcollection = () => {

        const variables = {
            collectionname: kollektionName,
            collectionuser: auth.user.name,
            collectionimages: collection,
        };
        
        //console.log(variables);
        
        axios.post('http://localhost:5000/api/imagecollections/collectionDB', variables)
            .then((res) => {
              if (res.data.success) {
                setUploadAccept(true);
                setKollektionName('');
                setCheckImage([]);
                setCollection([]);
              } else {
                console.log('collection not save');
              }
            })
            .catch((err) => {});
    };

    const renderImages = files.map((file, index) => {

        const id = file._id;

        //Wenn man ein Bild auswählt bzw. die Auswahl entfernt
        const addImage = () => {
            if(checkImage[index] == false || checkImage[index] == null){
                setCheckImage({...checkImage, [index]: true});
                setCollection({...collection, [index]:id});
            }else if(checkImage[index] == true){
                setCheckImage({...checkImage, [index]: false});

                delete(collection[index]);

            }
        }

        //console.log(collection);

        return(
          <div className="kollektion_main-post" key={index}>
            <button onClick={addImage} className="kollektion_main-post-button">
                {/* Bestätigungshaken */}
                <FontAwesomeIcon 
                    icon={["fas", "check"]}  
                    className={checkImage[index]==true ? "kollektion_main-post-button-icon kollektion_accept" : "kollektion_main-post-button-icon"}
                />

                {/* Bild */}
                <img 
                    src={`/${file.filepath}`} 
                    alt={file.filename} 
                    className="kollektion_main-post-image" 
                />
            </button>

          </div>
        )
    });

    return(
        <div className="kollektion">
            <Header />
            <div className="mainheader">
                <h2 className="mainheader-text">
                    Kollektion
                </h2>
            </div>

            {/* Bestätigungstext, wenn die Kollektion hochgeladen wurde */}
            {uploadAccept== true ?
                <div className="accept upload-accept">
                    <p className="accept-text upload-accept-text">
                        Sie haben sich erfolgreich registriert
                    </p>
                </div>
            : null}

            <div className="kollektion_main">
                <div>
                    <h3 className="kollektion_main-h3">
                        Kollektionname
                    </h3>

                    {/* Eingabefeld für den Kollektionsnamen */}
                    <input
                        type="text"
                        id="name"
                        onChange={onChangeKollektionName}
                        value={kollektionName}
                        className="kollektion_main-input inputfield"
                    />
                </div>

                {renderImages} 

                {/* "Kollektion erstellen"-Button */}
                <div className="kollektion_main-button">
                    <button onClick={sendcollection} className="button">
                        Kollektion erstellen
                    </button>
                </div>
            </div>
        </div>
    )
};

Kollektion.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Kollektion);