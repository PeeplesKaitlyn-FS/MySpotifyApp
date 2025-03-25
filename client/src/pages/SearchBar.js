import React, { useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track,artist,album`;
    fetch(url, {
      headers: {
        'Authorization': 'Bearer YOUR_SPOTIFY_TOKEN',
      },
    })
      .then(response => response.json())
      .then(data => setSearchResults(data));
  };

  return (
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
  );
};

export default SearchBar;