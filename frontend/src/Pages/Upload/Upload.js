/////////////////////////////////////////////////////////////////////

  //Upload

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Upload.scss';

import Header from '../../components/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

const Upload = ({ auth }) => {

    //Speichervariablen für den Upload
    const [file, setFile] = useState();
    const [ueberschrift, setUeberschrift] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [tags, setTags] = useState('');
    const [kategorie, setKategorie] = useState('');
    const [user, setUser] = useState();

    //Anzeigen eines Vorschaubildes
    const [previewUrl, setPreviewUrl] = useState('');

    //Meldungenskonstanten, falls etwas nicht ausgefüllt ist
    const [fileMessage, setFileMessage] = useState();
    const [ueberschriftMessage, setUeberschriftMessage] = useState();
    const [beschreibungMessage, setBeschreibungMessage] = useState();

    //Konstante - wenn Upload erfolgreich war
    const [uploadAccept, setUploadAccept] = useState(false);

    useEffect(() => {
        setUser(auth.user.name);

        if (!file) {
          return;
        }
    
        const fileReader = new FileReader();
    
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
    
        fileReader.readAsDataURL(file);
    }, [file]);

    //Änderung Überschrift
    const onChangeUeberschrift = (event) => {
        setUeberschriftMessage(null);
        setUeberschrift(event.target.value);
    };

    //Änderung Beschreibung
    const onChangeBeschreibung = (event) => {
        setBeschreibungMessage(null);
        setBeschreibung(event.target.value);
    };

    //Änderung Tags
    const onChangeTags = (event) => {
        setTags(event.target.value);
    };

    //Änderung Bild
    const onChangeFile = (event) => {
        setFile(event.target.files[0]);
        setFileMessage(null);
    };

    //Änderung Kategorie
    const onChangeKategorie = (event) => {
        setKategorie(event.target.value);
    };

    //Zurücksetzen des Vorschaubildes
    const resetImage = () => {
        setPreviewUrl('');
    }

    //Senden der Uploaddaten zum DB
    const send = () => {
        if(file != null && ueberschrift != '' && beschreibung != ''){
            const data = new FormData();

            data.append('ueberschrift', ueberschrift);
            data.append('file', file);


            axios.post('http://localhost:5000/api/uploads/uploadImage', data)                   //Speichern des Bildes im Backend
                .then((res) => {
                    
                    const variables = {
                        filename: ueberschrift,
                        filepath: res.data.image,
                        fileuser: user,
                        filedescription: beschreibung,
                        filecategory: kategorie,
                        filetags: tags,
                    };
            
                    axios.post('http://localhost:5000/api/uploads/uploadImageDB', variables)    //Speichern der Daten zum Bild in der DB
                        .then((resu) => {
                          if (resu.data.success) {
                            console.log('erfolg');
                          } else {
                          }
                    });

                    //Zurücksetzen aller Werte
                    setPreviewUrl('');
                    setUeberschrift('');
                    setBeschreibung('');
                    setTags('');
                    setKategorie('');
                    setUploadAccept(true);
                })
                .catch((res) => console.log('Kein Erfolg'));
            }

        //Fehlermeldungen, wenn etwas nicht ausgefüllt ist
        if(file==null){
            setFileMessage("Sie haben keine Bild ausgewählt, was hochgeladen wird")
        }
        if(ueberschrift==''){
            setUeberschriftMessage("Sie haben keine Überschrift ausgewählt")
        }
        if(beschreibung==''){
            setBeschreibungMessage("Sie müssen eine Beschreibung zu Ihrem Bild hinzufügen")
        }
    }
    
    return(
        <div className="upload">
            <Header />

            {/* Überschrift */}
            <div className="mainheader">
                <h1 className="mainheader-text">
                    Upload
                </h1>
            </div>

            {/* Bestätigungstext, wenn die Upload erfolgreich war */}
            {uploadAccept== true ?
                <div className="accept upload-accept">
                    <p className="accept-text upload-accept-text">
                        Sie haben sich erfolgreich registriert
                    </p>
                </div>
            : null}

            <form className="upload_main" action="#">

                {previewUrl
                && (
                    <div className="upload_main-file">
                        {/* wenn kein Datei ausgewählt ist */}
                        <p>
                            Datei:
                            <span className="red">*</span>
                        </p>
                        <button onClick={resetImage} className="upload_main-prevbutton">
                            <FontAwesomeIcon icon={["fas", "times"]}  className="upload_main-prevbutton-icon"/>
                            <img src={previewUrl} alt="Preview" className="upload_main-prevbutton-image" />
                        </button>
                    </div>
                )}
                {!previewUrl && (
                    <div className="upload_main-file">
                        {/* wenn eine Datei ausgewählt ist */}
                        <p>
                            Datei:
                            <span className="red">*</span>
                        </p>
                        {fileMessage ? 
                            <p className="upload_main-message">{fileMessage}</p> 
                        : null}
                        <input
                            type="file"
                            id="file"
                            onChange={onChangeFile}
                            accept=".jpg, .png"
                            className="upload_main-inputfile"
                        />
                    </div>
                )}

                {/* Bildüberschrift */}
                <div className="upload_main-ueberschrift">
                    <p>
                        Bilderüberschrift:
                        <span className="red">*</span>
                    </p>
                    {ueberschriftMessage ? 
                        <p className="upload_main-message">{ueberschriftMessage}</p> 
                    : null}
                    <input
                        type="text"
                        id="bildueberschrift"
                        onChange={onChangeUeberschrift}
                        value={ueberschrift}
                        className="inputfield"
                    />
                </div>

                {/* Beschreibung */}
                <div className="upload_main-beschreibung">
                    <p>
                        Beschreibung:
                        <span className="red">*</span>
                    </p>
                    {beschreibungMessage ? 
                        <p className="upload_main-message">{beschreibungMessage}</p> 
                    : null}
                    <textarea
                        type="text"
                        id="beschreibung"
                        onChange={onChangeBeschreibung}
                        value={beschreibung}
                        className="inputfield"
                    />
                </div>

                {/* Kategorie */}
                <div className="upload_main-Kategorie">
                    <p>Kategorie:</p>
                    <select 
                        id="role" 
                        onChange={onChangeKategorie} 
                        value={kategorie} 
                        className="inputfield upload_main-input-select"
                    >
                        <option value="" className="none"/>
                        <option value="Fotografie">Fotografie</option>
                        <option value="3D">3D</option>
                        <option value="Grafikdesign">Grafikdesign</option>
                        <option value="Prototyp">Prototyp</option>
                        <option value="Bild">Bild</option>
                        <option value="Gemälde">Gemälde</option>
                        <option value="Sonstiges">Sonstiges</option>
                    </select>
                </div>

                {/* Tags */}
                <div className="upload_main-tags">
                    <p>Tags:</p>
                    <input
                        type="text"
                        id="tags"
                        onChange={onChangeTags}
                        value={tags}
                        className="inputfield"
                    />
                </div>
            </form>

            {/* Uploadbutton */}
            <button onClick={send} className="button">
                Hochladen
            </button>
        </div>
    )
};

Upload.propTypes = {
    auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Upload);
