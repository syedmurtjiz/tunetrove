class Spotify {
    static async search(searchTerm, token) {
        try {
            if (!token) {
                throw new Error('No Spotify token available');
            }
            
            const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            
            if (!jsonResponse.tracks || !Array.isArray(jsonResponse.tracks.items)) {
                return [];
            }

            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artists[0]?.name || 'Unknown Artist',
                album: track.album?.name || 'Unknown Album'
            }));
        } catch (error) {
            console.error('Error in Spotify.search:', error);
            return [];
        }
    }
    static async createPlaylist(name, trackIds, token) {
        if (Array.isArray(trackIds) && trackIds.length) {
            const createPlaylistUrl = `https://api.spotify.com/v1/me/playlists`
            const response = await fetch(createPlaylistUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body : JSON.stringify({
                    name: name,
                    public: true
                  })
            });
            const jsonResponse = await response.json();
            const playlistId = jsonResponse.id;
            if (playlistId) {
                const replacePlaylistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
                await fetch(replacePlaylistTracksUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body : JSON.stringify({uris: trackIds.map(id => "spotify:track:".concat(id))})
                });
            }
        }
    }
}

export default Spotify;