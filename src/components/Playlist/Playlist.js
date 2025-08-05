import React, {useState} from 'react'
import './Playlist.css'
import Track from '../Track/Track'

function Playlist({ tracks, removeTrackFromPlaylist, createSpotifyPlaylist }) {
    const [playlistName, setPlaylistName] = useState("New Playlist");

    const handleSave = async (e) => {
        e.preventDefault();
        if (tracks.length === 0) return;
        
        const trackIds = tracks.map(t => t.id);
        await createSpotifyPlaylist(playlistName, trackIds);
    }

    return (
        <div className="Playlist">
            <input 
                value={playlistName}
                onChange={e => setPlaylistName(e.target.value)} 
                placeholder="New Playlist"
            />
            <div className="TrackList">
                {tracks.map(track => (
                    <Track 
                        key={track.id}
                        track={track}
                        trackActionCharacter="-"
                        handleTrackAction={removeTrackFromPlaylist}
                    />
                ))}
            </div>
            <button 
                className="Playlist-save" 
                onClick={handleSave}
                disabled={tracks.length === 0}
            >
                SAVE TO SPOTIFY
            </button>
        </div>
    )
}

export default Playlist;