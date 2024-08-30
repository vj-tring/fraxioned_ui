import React, { useState } from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './seach.module.css';

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, placeholder = 'Search by...' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper className={styles.searchContainer} elevation={1}>
      <IconButton className={styles.searchIcon} size="small" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      <InputBase
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {query && (
        <IconButton className={styles.clearIcon} size="small" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default Search;