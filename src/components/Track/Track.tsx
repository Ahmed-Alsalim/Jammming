import './Track.css';

interface TrackProps {
  track: Track;
  isPlaylist: boolean;
  onAdd: (track: Track) => void;
}

interface Track {
  id: number;
  name: string;
  artist: string;
  album: string;
  isAdded?: boolean;
}

function Track({ track, isPlaylist, onAdd }: TrackProps) {
  return (
    <div
      className='track'
      style={isPlaylist ? { paddingRight: 15 } : { paddingLeft: 15 }}
    >
      {isPlaylist && (
        <button
          id='removeButton'
          disabled={track.isAdded}
          onClick={() => onAdd(track)}
        >
          -
        </button>
      )}

      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>

      {!isPlaylist && (
        <button
          id='addButton'
          disabled={track.isAdded}
          onClick={() => onAdd(track)}
        >
          +
        </button>
      )}
    </div>
  );
}

export default Track;
