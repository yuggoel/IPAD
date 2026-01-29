/**
 * iTunes Search API Service
 * Endpoint: https://itunes.apple.com/search
 */

// Use a relative API path so dev/prod can proxy the request and avoid CORS.
// Dev: Vite proxy forwards `/api/itunes` to `https://itunes.apple.com/search`
// Prod: Vercel serverless function at `/api/itunes` will forward the request.
const BASE_URL = '/api/itunes';

/**
 * Adapt iTunes track to iPod format
 */
const adaptTrack = (track) => {
    if (!track || track.kind !== 'song') return null;

    // specific replacement to get high-res playback
    // iTunes usually returns 100x100, we can guess 600x600 exists
    const artwork = track.artworkUrl100 
        ? track.artworkUrl100.replace('100x100', '600x600') 
        : null;
    
    const thumbnail = track.artworkUrl60 || track.artworkUrl30;

    return {
        _id: String(track.trackId),
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        cover_image: artwork, // High-res for Now Playing
        thumbnail: thumbnail, // Low-res for Lists
        media_url: track.previewUrl,
        duration: 30,
        price: track.trackPrice,
        releaseDate: track.releaseDate,
        genre: track.primaryGenreName
    };
};

export const musicService = {
    /**
     * Search for tracks
     * @param {string} query - Artist, Song, or Album
     * @param {number} limit 
     */
    searchTracks: async (query, limit = 25) => { // Reduced default from 50 to 25
        try {
            // "entity=song" ensures we don't get audiobooks or music videos
            const url = `${BASE_URL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`iTunes API Error: ${response.status}`);
            
            const data = await response.json();
            return data.results.map(adaptTrack).filter(Boolean);
        } catch (error) {
            console.error("Music Fetch Error:", error);
            throw error;
        }
    },

    /**
     * Get Charts / Suggestions
     * iTunes doesn't have a direct "Charts" API that is public without RSS, 
     * but we can simulate it by searching for common generic terms or popular artists.
     */
    getTrending: async (limit = 25) => {
        // Generic search for popular music
        return musicService.searchTracks('Top Hits', limit);
    },

    /**
     * Get Playlists
     * Simulated with curated searches
     */
    getPlaylists: async (limit = 25) => {
        return musicService.searchTracks('Playlist Hits', limit);
    },

    /**
     * Get Albums
     * Simulated with popular album searches
     */
    getAlbums: async (limit = 25) => {
        return musicService.searchTracks('Top Albums', limit);
    },

    /**
     * Get Artists
     * Simulated with popular artist searches
     */
    getArtists: async (limit = 25) => {
        return musicService.searchTracks('Top Artists', limit);
    }
};
