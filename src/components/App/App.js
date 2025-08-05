import React, { useState, useEffect } from 'react';
import './App.css';
import Spotify from '../../utils/Spotify';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

const App = () => {
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract token from URL hash after Spotify redirect
    const hash = window.location.hash;
    let token = window.localStorage.getItem('spotifyToken');

    if (!token && hash) {
      // Extract token from URL hash
      const params = new URLSearchParams(hash.substring(1));
      token = params.get('access_token');
      
      if (token) {
        // Store token in localStorage
        window.localStorage.setItem('spotifyToken', token);
        // Clear the URL hash
        window.history.pushState({}, document.title, window.location.pathname);
      }
    }

    if (token) {
      setSpotifyToken(token);
    }
  }, []);

  const searchSpotify = async (terms) => {
    if (!terms.trim()) {
      setSearchedTracks([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await Spotify.search(terms, spotifyToken);
      setSearchedTracks(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching Spotify:', error);
      setError('Failed to search tracks. Please try again.');
      setSearchedTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createSpotifyPlaylist = async (name, trackIds) => {
    if (!spotifyToken) {
      setError('Please authenticate with Spotify first.');
      return;
    }
    
    if (!trackIds.length) {
      setError('Please add tracks to your playlist.');
      return;
    }
    
    try {
      await Spotify.createPlaylist(name, trackIds, spotifyToken);
      setPlaylistTracks([]);
      setError(null);
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError('Failed to create playlist. Please try again.');
    }
  };

  const addTrackToPlaylist = (track) => {
    if (!track || !track.id) return;
    
    setPlaylistTracks(prev => 
      prev.some(t => t.id === track.id) 
        ? prev 
        : [...prev, track]
    );
  };

  const removeTrackFromPlaylist = (track) => {
    if (!track || !track.id) return;
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };
  return (
    <div>
      <h1>Ja<span className="highlight">mm</span>ing</h1>
      <div className="App">
        <SearchBar 
          searchSpotify={searchSpotify} 
          hasToken={!!spotifyToken} 
        />
        <div className="App-playlist">
          <SearchResults 
            tracks={searchedTracks} 
            addTrackToPlaylist={addTrackToPlaylist}
            isLoading={isLoading}
            error={error}
          />
          <Playlist 
            tracks={playlistTracks}
            removeTrackFromPlaylist={removeTrackFromPlaylist}
            createSpotifyPlaylist={createSpotifyPlaylist}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
