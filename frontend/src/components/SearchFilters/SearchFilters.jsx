import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchFilters.css';

const SearchFilters = ({ 
  selectedDate, 
  setSelectedDate, 
  opponentName, 
  setOpponentName, 
  onClear 
}) => {
  return (
    <div className="search-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="date-filter" className="filter-label">
            Data
          </label>
          <input
            id="date-filter"
            type="text"
            className="filter-input"
            placeholder="DD/MM/AAAA"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="opponent-filter" className="filter-label">
            Adversário
          </label>
          <input
            id="opponent-filter"
            type="text"
            className="filter-input opponent-input"
            placeholder="Nome do adversário"
            value={opponentName}
            onChange={(e) => setOpponentName(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button className="search-btn" type="button">
            <Search size={18} />
            Buscar
          </button>
          
          <button className="clear-btn" type="button" onClick={onClear}>
            <X size={18} />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;