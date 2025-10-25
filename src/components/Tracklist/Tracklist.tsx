import './Tracklist.css';
import Track from '../Track/Track';
import type { TrackData } from '../../types';

interface TracklistProps {
  tracks: TrackData[];
  isPlaylist: boolean;
  handleAddTrack: (track: TrackData) => void;
}

function Tracklist({ tracks, isPlaylist, handleAddTrack }: TracklistProps) {
  return (
    <div
      data-testid='tracklist'
      className='tracklist'
    >
      {tracks.length > 0 ? (
        tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            isPlaylist={isPlaylist}
            onAdd={handleAddTrack}
          />
        ))
      ) : (
        <p>No tracks available</p>
      )}
    </div>
  );
}

export default Tracklist;
