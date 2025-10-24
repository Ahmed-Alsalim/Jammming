import { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
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
      <button onClick={onSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
