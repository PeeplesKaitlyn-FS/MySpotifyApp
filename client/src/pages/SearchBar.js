import React, { useState } from 'react';
import Login from './Login';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  const handleLogin = (token) => {
    setAccessToken(token);
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
      {accessToken && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for music"
          />
          <button type="submit">Search</button>
          {searchResults.length > 0 && (
            <ul>
              {searchResults.tracks.items.map(track => (
                <li key={track.id}>{track.name}</li>
              ))}
            </ul>
          )}
        </form>
      )}
    </div>
  );
};

export default SearchBar;