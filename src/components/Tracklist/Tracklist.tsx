import './Tracklist.css';
import Track from '../Track/Track';
import type { Track as TrackType } from '../../types';

interface TracklistProps {
  tracks: TrackType[];
  isPlaylist: boolean;
  handleAddTrack?: (track: TrackType) => void;
  handleRemoveTrack?: (track: TrackType) => void;
}

function Tracklist({
  tracks,
  isPlaylist,
  handleAddTrack,
  handleRemoveTrack,
}: TracklistProps) {
  return (
    <div
      data-testid='tracklist'
      className='tracklist'
    >
      {tracks.length > 0 &&
        tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            isPlaylist={isPlaylist}
            onAdd={handleAddTrack}
            onRemove={handleRemoveTrack}
          />
        ))}
    </div>
  );
}

export default Tracklist;
