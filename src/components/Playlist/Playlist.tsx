import './Playlist.css';
import Tracklist from '../Tracklist/Tracklist';
import type { TrackData } from '../../types';
import { useState } from 'react';

interface PlaylistProps {
  playlistTracks: TrackData[];
  onRemoveTrack: (track: TrackData) => void;
}

function Playlist({ playlistTracks, onRemoveTrack }: PlaylistProps) {
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
    Promise.resolve()
      .then(() => {
        console.log('Playlist saved to Spotify!');
        setSaveSuccess(true);
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
