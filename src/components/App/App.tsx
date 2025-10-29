import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SpotifyLoginButton from '../SpotifyLoginButton/SpotifyLoginButton';
import type { TrackData } from '../../types';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addedTracks, setAddedTracks] = useState<TrackData[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleAddTrack = (track: TrackData) => {
    setAddedTracks((prevTracks) => {
      if (prevTracks.find((t) => t.id === track.id)) {
        return prevTracks;
      }
      return [...prevTracks, track];
    });
  };

  const handleRemoveTrack = (track: TrackData) => {
    setAddedTracks((prevTracks) => prevTracks.filter((t) => t.id !== track.id));
  };

  const handleTokenChange = (token: string | null) => {
    setAccessToken(token);
  };

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
    }
  }, []);

  return (
    <>
      <header className='navBar'>
        <div id='nav-left'>{/* Empty div for left spacing */}</div>

        <div id='nav-center'>
          <h1 id='title'>Jammming</h1>
          <h3 id='subtitle'>make your playlist</h3>
        </div>

        <div id='nav-right'>
          <SpotifyLoginButton
            isAuthenticated={!!accessToken}
            onTokenChange={handleTokenChange}
          />
        </div>
      </header>

      <main>
        {accessToken ? (
          <>
            <SearchBar onSearch={setSearchTerm} />
            <div className='container'>
              <div className='grid-container'>
                <SearchResults
                  searchTerm={searchTerm}
                  addedTracks={addedTracks}
                  onAddTrack={handleAddTrack}
                />

                <Playlist
                  playlistTracks={addedTracks}
                  onRemoveTrack={handleRemoveTrack}
                />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p>Please login with Spotify to continue</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
