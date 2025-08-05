import React from 'react';
import './Track.css';

const Track = ({ track, handleTrackAction, trackActionCharacter }) => (
  <div className="Track">
    <div className="Track-information">
      <h3>{track.title}</h3>
      <p>{track.artist} | {track.album}</p>
    </div>
    <a className="Track-action" onClick={() => handleTrackAction(track)}>
      {trackActionCharacter}
    </a>
  </div>
);

export default Track;
