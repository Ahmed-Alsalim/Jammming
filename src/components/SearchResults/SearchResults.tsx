import './SearchResults.css';
import { useCallback, useEffect, useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import type {
  SearchResults as SearchResultsType,
  TrackData,
} from '../../types';
import { spotifyFetch } from '../../utils/FetchHelper';

interface SearchResultsProps {
  addedTracks: TrackData[];
  searchTerm: string;
  onAddTrack: (track: TrackData) => void;
}

function SearchResults({
  searchTerm = '',
  addedTracks,
  onAddTrack,
}: SearchResultsProps) {
  const [results, setResults] = useState<TrackData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateAddedStatus = useCallback(() => {
    console.log('Updating added status in search results');
    console.log('Added tracks:', addedTracks);
    setResults((prevResults = []) =>
      prevResults.map((result) =>
        addedTracks?.some(({ id }) => id === result.id)
          ? { ...result, isAdded: true }
          : { ...result, isAdded: false }
      )
    );
  }, [addedTracks]);

  const fetchResults = useCallback(() => {
    setIsLoading(true);
    setError(null);
    spotifyFetch(`/search?type=track&q=${searchTerm}`, {
      method: 'GET',
    })
      .then((data: SearchResultsType<['track']>) => {
        setResults(data.tracks?.items || []);
      })
      .catch((err) => {
        console.error('Error fetching search results:', err);
        setError(err.message || 'Error fetching results');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [searchTerm, fetchResults]);

  useEffect(() => {
    console.log('Results or addedTracks changed, updating added status');
    updateAddedStatus();
  }, [addedTracks, updateAddedStatus]);

  return (
    <div
      id='searchResultsContainer'
      data-testid='search-results'
    >
      <h2 id='results-title'>Search Results</h2>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>Error fetching results: {error}</p>}
      {!isLoading && !error && results.length === 0 && searchTerm && (
        <p>No results found</p>
      )}

      <Tracklist
        isPlaylist={false}
        tracks={results}
        handleAddTrack={onAddTrack}
      />
    </div>
  );
}

export default SearchResults;
