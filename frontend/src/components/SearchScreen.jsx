import React, { useState } from 'react';
import { useIpod } from '../context/IpodContext';
import { musicService } from '../services/musicService';

const SearchScreen = () => {
  const { searchQuery, setSearchQuery, setData, navigateTo, setLoading } = useIpod();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const handleSearch = async () => {
    if (!localQuery.trim()) return;
    
    setSearchQuery(localQuery);
    setLoading(true);
    
    try {
      const results = await musicService.searchTracks(localQuery, 25);
      if (results && results.length > 0) {
        setData(results);
        setLoading(false);
        navigateTo('LIST', results, `Search: ${localQuery}`);
      } else {
        alert('No results found');
        setLoading(false);
      }
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-screen">
      <div className="menu-header">
        <h2 className="menu-title">Search Music</h2>
      </div>
      <div className="search-content" style={{ padding: '20px' }}>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for songs, artists, albums..."
          autoFocus
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
        {searchQuery && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Last search: {searchQuery}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
