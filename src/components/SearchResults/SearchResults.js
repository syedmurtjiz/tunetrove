import React from 'react';
import './SearchResults.css';
import Track from '../Track/Track';

const SearchResults = ({ tracks = [], addTrackToPlaylist, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          <div className="loading-spinner"></div>
          <p>Loading tracks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!tracks.length) {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          <p>No tracks found. Try a different search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <div className="TrackList">
        {tracks.map(track => (
          <Track
            key={track.id}
            track={track}
            trackActionCharacter="+"
            handleTrackAction={addTrackToPlaylist}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
