import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ searchSpotify, hasToken }) {
  const [searchTerm, setSearchTerm] = useState(window.localStorage.getItem('searchTerm') || "");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    if (!hasToken) {
      setIsAuthenticating(true);
      const redirectUri = encodeURIComponent(window.location.origin + '/');
      const clientId = '0744a9d113234aed9830ca9b36b3be57';
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-modify-public&show_dialog=true`;
      
      window.localStorage.setItem('pendingSearch', searchTerm);
      window.location.href = authUrl;
      return;
    }

    try {
      setIsAuthenticating(true);
      await searchSpotify(searchTerm);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (hasToken) {
      const pendingSearch = window.localStorage.getItem('pendingSearch');
      if (pendingSearch) {
        setSearchTerm(pendingSearch);
        searchSpotify(pendingSearch);
        window.localStorage.removeItem('pendingSearch');
      }
    }
  }, [hasToken, searchSpotify]);

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          placeholder="Search for a song..."
          disabled={isAuthenticating}
          className="search-bar-input"
        />
        <button
          type="submit"
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isAuthenticating}
          className="search-bar-button"
        >
          {isAuthenticating ? (
            <span className="search-bar-loading">
              <svg className="spinner" viewBox="0 0 24 24">
                <circle className="spinner-circle" cx="12" cy="12" r="10" />
                <path className="spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;