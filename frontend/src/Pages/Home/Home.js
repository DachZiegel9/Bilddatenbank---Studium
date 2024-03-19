/////////////////////////////////////////////////////////////////////

  //Home

/////////////////////////////////////////////////////////////////////

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Home.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../../components/Header';

import Posts from '../../components/Post';

import { connect } from 'react-redux';

const Home = ({ auth }) => {

  const [didMount, setDidMount] = useState(false); 
  const [scroll, setScroll] = useState(false);

  //Speichern der Eingaben im Suchfeld
  const [searchInput, setSearchInput] = useState('');

  //Speichern der Bilder
  const [files, setFiles] = useState([]);


  useEffect(() => {
    const filter = {
      searchTerm: searchInput,
    };

    getImage(filter);

    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });

    setDidMount(true);
    return () => setDidMount(false);
  }, [searchInput]);

  //Abrufen der Bilder
  const getImage = (filter) => {
    axios.post('http://localhost:5000/api/uploads/getImage', filter)
      .then((res) => {
        if (res.data.success) {
          setFiles(res.data.Uploads);
        }
      })
      .catch(() => {
      });
  };

  //Änderung im Suchfeld
  const onChangeSearch = (event) => {
    setSearchInput(event.target.value);
  };

  return(
    <div className="home">
      <Header />
      <div className="home_header">
        <h1>
          {`Willkommen zurück ${auth.user.name}!`}
          
        </h1>
      </div>

      {/* Suchfeld */}
      <div className={scroll ? "home_search home_search-scroll" : "home_search"}>
        <input
          type="text"
          name="search"
          value={searchInput}
          id="search-input"
          placeholder="Suche..."
          onChange={onChangeSearch}
          className="home_search-input"
        />
        <FontAwesomeIcon icon={['fas', 'search']} size="lg" className="home_search-icon" />
      </div>


      {/* Posts */}
      <div className="home_main">
        {files.length != 0 ?
          <Posts search={searchInput} searchId={false} searchHome={true}/>
        : 
          <div>
            <p>Es gibt aktuell keine Posts</p>
          </div>
        }
      </div>
    </div>
  )
};

Home.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Home);