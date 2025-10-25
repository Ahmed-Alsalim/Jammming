import './Track.css';

interface TrackProps {
  track: Track;
  onAdd: (track: Track) => void;
}

interface Track {
  id: number;
  name: string;
  artist: string;
  album: string;
  isAdded?: boolean;
}

function Track({ track, onAdd }: TrackProps) {
  return (
    <div className='track'>
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>

      <button
        id='addButton'
        disabled={track.isAdded}
        onClick={() => onAdd(track)}
      >
        +
      </button>
    </div>
  );
}

export default Track;
