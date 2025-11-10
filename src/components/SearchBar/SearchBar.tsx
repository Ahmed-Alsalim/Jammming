import { useEffect, useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue, onSearch]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        id='searchBarContainer'
        data-testid='search-bar'
      >
        <input
          value={inputValue}
          placeholder='Enter A Song, Album, or Artist'
          type='text'
          autoFocus
          onChange={(e) => setInputValue(e.target.value)}
        />
        <span className='search-icon'>🔍</span>
      </div>
    </div>
  );
};

export default SearchBar;
