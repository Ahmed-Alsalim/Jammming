import './SearchResults.css';
import { useCallback, useEffect, useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import type { TrackData } from '../../types';

interface SearchResultsProps {
  addedTracks?: TrackData[];
  searchTerm?: string;
}
interface SearchResult extends TrackData {
  isAdded?: boolean;
}

function SearchResults({ searchTerm = '', addedTracks }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddTrack = (track: SearchResult) => {
    console.log(`Adding track: ${track.name}`);
  };

  const updateAddedStatus = useCallback(() => {
    if (addedTracks) {
      setResults((prevResults) =>
        prevResults.map((result) =>
          addedTracks.some(({ id }) => id === result.id)
            ? { ...result, isAdded: true }
            : result
        )
      );
    }
  }, [addedTracks]);

  const fetchResults = useCallback(() => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching results for: ${searchTerm}`);
    Promise.resolve({
      json: async () => ({
        results: [
          { id: 1, name: 'Song A', artist: 'Artist A', album: 'Album A' },
          { id: 2, name: 'Song B', artist: 'Artist B', album: 'Album B' },
        ],
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResults(data.results || []);
        updateAddedStatus();
      })
      .catch((err) => {
        console.error('Error fetching search results:', err);
        setError(err.message || 'Error fetching results');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm, updateAddedStatus]);

  useEffect(() => {
    if (searchTerm) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [searchTerm, fetchResults]);

  useEffect(() => {
    updateAddedStatus();
  }, [addedTracks, updateAddedStatus]);

  return (
    <div
      id='searchResultsContainer'
      data-testid='search-results'
    >
      <div className='resultsList'>
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>Error fetching results: {error}</p>}
        {!isLoading && !error && results.length === 0 && searchTerm && (
          <p>No results found</p>
        )}

        <Tracklist
          isPlaylist={false}
          tracks={results}
          handleAddTrack={handleAddTrack}
        />
      </div>
    </div>
  );
}

export default SearchResults;
