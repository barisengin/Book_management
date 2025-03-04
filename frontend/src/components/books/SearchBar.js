// src/components/books/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, ISBN..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        {localSearchTerm && (
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;