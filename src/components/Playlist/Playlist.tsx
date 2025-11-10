import './Playlist.css';
import { spotifyFetch } from '../../utils/FetchHelper';
import { useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import type { TrackData, Playlist as PlaylistType } from '../../types';

interface PlaylistProps {
  playlistTracks: TrackData[];
  userId?: string;
  onRemoveTrack: (track: TrackData) => void;
}

function Playlist({ playlistTracks, userId, onRemoveTrack }: PlaylistProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSaveSuccess(false);
    setError(null);

    if (!playlistTitle) {
      setError('Please enter a playlist title.');
      return;
    }

    if (playlistTracks.length === 0) {
      setError('Please add at least one track to the playlist.');
      return;
    }
    setIsSaving(true);

    spotifyFetch(`/users/${userId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({ name: playlistTitle }),
    })
      .then((data: PlaylistType) => {
        const playlistId = data.id;
        return spotifyFetch(`/playlists/${playlistId}/tracks`, {
          method: 'POST',
          body: JSON.stringify({
            uris: playlistTracks.map((track) => track.uri),
          }),
        });
      })
      .then(() => {
        console.log('Playlist saved to Spotify!');
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        setPlaylistTitle('');
        playlistTracks.forEach((track) => onRemoveTrack(track));
      })
      .catch((err) => {
        console.error('Error saving playlist:', err);
        setError(err.message || 'Error saving playlist');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div
      className='playlist'
      data-testid='playlist'
    >
      <input
        value={playlistTitle}
        className='title-input'
        placeholder='Enter Playlist Name'
        onChange={(e) => setPlaylistTitle(e.target.value)}
      />

      <Tracklist
        tracks={playlistTracks}
        isPlaylist={true}
        handleRemoveTrack={onRemoveTrack}
      />

      <button
        className='save-button'
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? 'Saving...' : 'Save to Spotify'}
      </button>

      {saveSuccess && (
        <div className='success-message'>
          <p>Playlist saved successfully!</p>
        </div>
      )}
      {error && (
        <div className='error-message'>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Playlist;
