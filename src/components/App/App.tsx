import './App.css';
import SearchBar from '../SearchBar/SearchBar';

function App() {
  const handleSearch = () => {
    // Handle search logic here
  };

  return (
    <>
      <header className='navBar'>
        <h1 id='title'>Jammming</h1>
        <h3 id='subtitle'>make your playlist</h3>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} />
      </main>
    </>
  );
}

export default App;
