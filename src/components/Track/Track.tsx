import './Track.css';
import type { TrackData } from '../../types';

interface TrackProps {
  track: TrackData;
  isPlaylist: boolean;
  onAdd?: (track: TrackData) => void;
  onRemove?: (track: TrackData) => void;
}

function Track({ track, isPlaylist, onAdd, onRemove }: TrackProps) {
  return (
    <div
      className='track blur-background highlighted'
      style={isPlaylist ? { paddingRight: 15 } : {}}
    >
      {isPlaylist && (
        <button
          id='removeButton'
          onClick={() => onRemove?.(track)}
        >
          -
        </button>
      )}

      <img
        src={track.album?.images[0]?.url}
        alt={track.name}
        width='100'
        object-fit='cover'
        className='track-image'
      />

      <div className='track-information'>
        <h3>
          <a
            href={track.external_urls?.spotify}
            target='_blank'
            rel='noopener noreferrer'
          >
            {track.name}
          </a>
        </h3>
        <p>
          Artists:{' '}
          <b>{track.artists?.map(({ name }) => name).join(', ') || ''}</b>
        </p>
        <p>
          Album: <b>{track.album?.name || ''}</b>
        </p>
      </div>

      {!isPlaylist && (
        <button
          id='addButton'
          disabled={track.isAdded}
          onClick={() => onAdd?.(track)}
        >
          +
        </button>
      )}
    </div>
  );
}

export default Track;
