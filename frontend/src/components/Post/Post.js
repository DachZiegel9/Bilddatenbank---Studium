/////////////////////////////////////////////////////////////////////

  //Postbeiträge

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import './Post.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Post =  ({ auth, search, classes, styleclass, searchId, searchHome }) => {

    const [didMount, setDidMount] = useState(false); 
    const [scroll, setScroll] = useState(false);

    //speicherung aller Bilder
    const [files, setFiles] = useState([]);

    //speicherung der Eingaben in das Kommentarfeld
    const [commentInput, setCommentInput] = useState(['']);

    //speicherung, bei welchem Bild die letze Kommentaränderung vorgenommen wurden
    const [imageIndex, setImageIndex] = useState();

    //Speicherung aller Kommentare
    const [comments, setComments] = useState([]);

    //Konstante, welche sich nur ändert, wenn ein neuer Kommentar erstellt wurde, damit die useEffect nur dann aktualisert
    const [newComment, setNewComment] = useState('');

    //Speicherung, wie viele Kommentare unter einem Post angezeigt werden
    const [comleng, setComLeng] = useState(3);

    //Speicherung der aktuellen Sucheingaben
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const filter = {
            searchTerm: search,
        };

        setSearchInput(search);

        getImage(filter);

        getComments();

        setNewComment(false);

        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 120);
        });

        setDidMount(true);
        return () => setDidMount(false);
    }, [newComment, search]);

    const getImage = (filter) => {
        //Abrufen Bilder, wenn nach user, name, kategorie oder tags gesucht wird
        if(searchId == false){
            axios.post('http://localhost:5000/api/uploads/getImage', filter)
            .then((res) => {
                if (res.data.success) {
                    setFiles(res.data.Uploads);
                }
            })
            .catch(() => {});
        }
        //Abrufen Bilder, wenn nach ID gesucht wird
        else if(searchId == true){
            axios.post('http://localhost:5000/api/uploads/getImageDetail', filter)
                .then((res) => {
                    if (res.data.success) {
                        setFiles(res.data.Uploads);
                    }
                })
                .catch(() => {});
        }
    };

    //Abrufen aller Kommentare
    const getComments = () => {
        axios.post('http://localhost:5000/api/imagecomments/getComments')
            .then((res) => {
                if (res.data.success) {
                    setComments(res.data.Comments);
                }
            })
            .catch(() => {});
    };

    const renderImages = files.map((file, index) => {

        //Aufsplitten des Uploaddatums
        const date1 = file.file_date.split('-');
        const date2 = date1[date1.length-1].split('.');
        const date3 = date2[0].split('T');

        //Zähler der Kommentare unter einem Post
        let checkcommentlength = 0;

        //Variable, ob ein "Mehr Kommentare anzeigen"-Button vorhanden ist oder gebraucht wird
        let onebutton=0;

        //Splitten des Tag-String in die einzelnen Wörter
        const hashtags = file.filetags.split(' ');

        //falls der Benutzername aus mehreren Wörtern besteht, wandelt der die Leerzeichen zu Unterstrichen um, damit die URLs zum Profil keine Leerzeichen haben
        const linkUser = file.fileuser.split(' ').join('_');

        //Variable, ob die eine Kategorie ausgewählt ist 
        var existcategory = true;
        if(file.filecategory == ''){
            existcategory = false;
        }

        //Änderung im Kommentarfeld
        const onChangeComment = (event) => {
            setCommentInput({...commentInput, [index]:event.target.value});
            setImageIndex(file._id);
        }

        //Hochladen des Kommentars
        const sendComment = () => {
            if(commentInput[index]!=null){
                const variables = {
                    commentname: commentInput[index],
                    commentuser: auth.user.name,
                    commentimage: imageIndex,
                };
  
                axios.post('http://localhost:5000/api/imagecomments/commentDB', variables)
                    .then((res) => {
                        if (res.data.success) {
                            console.log('comment save');
                        } else {
                            console.log('comment not save');
                        }
                    });
            }

            setNewComment(index);
            setCommentInput({...commentInput, [index]:''});

            getComments();
        }

        //Mehr Kommentare anzeigen
        const moreComments = () => {
            setComLeng(comleng+3);
            getComments();
        }

    return(
        <div className="post" key={index}>

            {/* User anzeigen */}
            <Link to={`/profil/${linkUser}`} className="post-link">
                <div className="post-header">
                    <FontAwesomeIcon icon={["fas", "user-circle"]}  className="post-header-icon"/>
                    <p className="post-header-p">{file.fileuser}</p>
                </div>
            </Link>

            {/* Überschrift */}
            <div className="post-head">
                <h3 className="post-head-h3">{file.filename}</h3>
            </div>

            {/* Bild */}
            <Link to={`/detailimage/${file._id}`}>
                <img src={`/../${file.filepath}`} alt={file.filename} className={`post-image ${styleclass}`} />
            </Link>

            <div className={`post-main ${styleclass}`}>
                <p className="post-main-user">{file.fileuser}:</p>

                {/* Bilbeschreibung */}
                <p className="post-main-description">{file.filedescription}</p>

                {/* Bilderkategorie */}
                {existcategory == true ? 
                    <div>
                        <p className="post-main-category2">Kategorie: </p>
                        <p className="post-main-category">{file.filecategory}</p>
                    </div>
                : null}

                {/* Tags */}
                <div className={`post-main-tags ${styleclass}-tags`}>
                    {hashtags.map((hashtag, hashtagindex) =>{
                        const searchTag = () => {
                            const filter = {
                                searchTerm: hashtag,
                            };

                            setSearchInput(hashtag);
                        
                            getImage(filter);
                        }

                        return(       
                            <div key={hashtagindex} className="post-main-tags-tag">
                                <button className="post-main-tags-tag-button" onClick={searchTag}>
                                    {hashtag}
                                </button>
                            </div>
                        )
                    })}
                </div>
          
                {/* Uploaddatum */}
                <p className={`post-main-date ${styleclass}-date`}>{date3[1]} {date3[0]}.{date1[1]}.{date1[0]}</p>
            </div>

            {/* Kommentare */}
            <div className="comment">
                <p className="comment-p">Kommentare:</p>

                {comments.map((comment, commentindex) =>{
                    //Aufsplitten des Kommentardatums
                    const datecommet = comment.comment_date.split('-');
                    const datecommet2 = datecommet[datecommet.length-1].split('.');
                    const datecommet3 = datecommet2[0].split('T');

                    //wenn der Kommentar zum Bild gehört, dann wird der Kommentarzähler um eins erhöht, damit nicht zu viele Kommentare angezeigt werden
                    if(comment.commentimage === file._id){
                        checkcommentlength++;
                    }

                    //wenn der Kommentar zum Bild gehört und weniger als x (Standard 3) Kommentare angezeigt, dann soll der Kommentar angezeigt werden
                    if(comment.commentimage === file._id && checkcommentlength<=comleng){
                        return ( 
                            <div key={commentindex} className="comment-users">
                                <p className="comment-users-user">{comment.commentuser}</p>
                                <p className="comment-users-comment">{comment.commentname}</p>
                                <p className="comment-users-date">
                                    {datecommet3[1]} {datecommet3[0]}.{datecommet[1]}.{datecommet[0]}
                                </p>
                
                            </div>
                        );
                    } 
            
                    //"Mehr Kommentare anzeigen"-Button
                    if(checkcommentlength>comleng && onebutton==0){
                        onebutton++;
                        return(
                            <div key={commentindex} className="comment-more">
                                <button className="comment-more-button" onClick={moreComments}>
                                    Mehr Kommentare anzeigen
                                </button>
                            </div>
                        )
                    }

                })}

            {/* Eingabezeile, um einen Kommentar zu schreiben */}
            <input
                type="text"
                name="comment"
                key={index}
                value={commentInput[index] || ''}
                id="comment-input"
                placeholder="Geben Sie einen Kommentar ein...."
                onChange={onChangeComment}
                className={`comment-input ${styleclass}-input`}
            />
            <button onClick={sendComment} className={`comment-button ${styleclass}-button`}>
                <FontAwesomeIcon icon={["fas", "chevron-circle-right"]}  className="comment-button-icon"/>
            </button>
        </div>
      </div>
    )
    });

    return(
        <div className={classes}>

            {/* wonach gesucht wird / Suchergebnis */}
            {searchHome == true && searchInput != '' ?
                <div className={scroll ? "searchinput" : "searchinput-normal"}>
                    <p>Suche nach: <b>{searchInput}</b></p>
                </div>
            :null}

            {renderImages}
        </div>
    )
};

Post.propTypes = {
    auth: PropTypes.objectOf(PropTypes.any).isRequired,
    search: PropTypes.string,                               //Sucheingabe
    classes: PropTypes.string,                              //bestimme Klassenvorgabe
    styleclass: PropTypes.string,                           //bestimme Gestaltungsklassenvorgabe
    searchId: PropTypes.bool,                               //Ob nach einer Id gesucht werden soll
    searchHome: PropTypes.bool,                             //Ob die Posts auf der Startseite angezeigt werden
};

Post.defaultProps = {
    searchId: false,
    searchHome: false,
};
  

const mapStateToProps = (state) => ({
    auth: state.auth,
});
  
export default connect(mapStateToProps)(Post);